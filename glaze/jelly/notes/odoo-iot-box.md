# Odoo IoT box and hardware bridge

**Source.** github.com/odoo/odoo 19.0, `addons/iot_box_image`, `addons/iot_drivers`, `addons/point_of_sale/static/src/app`; github.com/odoo/documentation 19.0, `content/applications/general/iot/*`, `.../point_of_sale/hardware_network/receipt_printers.rst`; odoo.com/app/iot-faq. LGPL-3. Read 2026-10-29. Nothing under `odoo/enterprise` was opened.

## What it is

The IoT box is a Raspberry Pi running a database-less Odoo process, the hardware proxy, that exposes HTTP routes on the LAN. The POS page finds the box by IP, polls it for status, and sends receipts as images. The box turns the image into ESC/POS or Star raster bytes and spools them through CUPS or `win32print`. The same code ships as the Windows virtual IoT installer. A second path skips the box: Epson network printers that speak ePOS XML are driven from the browser. Production use of a box carries a monthly subscription.

## Observed

| Thing | Where (file, line or function) | What it does |
|---|---|---|
| Image | `iot_box_image/__manifest__.py`; `build_utils/download_requirements.sh` (40, 49); `build_image.sh` | `installable: False`; base is `2024-11-19-raspios-bookworm-armhf-lite`; the script overlays files, runs `init_image.sh` in a qemu chroot, writes version `yy.mm` (21, 73), runs `zerofree`; ngrok for ARM is bundled |
| Proxy module | `iot_drivers/__manifest__.py`; `tools/route.py` `iot_route` (9 to 31) | "Hardware Proxy", `installable: False`; every route gets `auth='none'` and `save_session=False` |
| Hello and status | `controllers/proxy.py` (10, 14) | `/hw_proxy/hello` returns the string `ping`, `cors='*'`; `/hw_proxy/status_json` returns `get_status()` per registered driver |
| Printer route | `iot_handlers/drivers/printer_driver_L.py` `PrinterController` (241 to 252) | `/hw_proxy/default_printer_action` picks the first printer with `device_connection == 'direct'` and runs `action(data)` |
| Handshake | `services/hardware_proxy_service.js` `connect` (56) | the client calls `message("handshake")`; no `/hw_proxy/handshake` route was found in the `iot_drivers` files read |
| Finding the box | `hardware_proxy_service.js` `autoConnect` (82 to 97), `checkProxyAvailability` (143 to 161) | uses `proxy_ip` from `pos.config` or `localStorage.hw_proxy_url`; up to four `fetch` calls to `/hw_proxy/hello`, each aborted at 1000 ms; no discovery |
| Poll | `hardware_proxy_service.js` `keepAlive` (100 to 121) | `status_json` every 5000 ms with a 2500 ms XHR timeout |
| Receipt render | `utils/printer/base_printer.js` `printReceipt` (22 to 53), `processCanvas` (67) | HTML receipt to canvas via `htmlToCanvas`, then base64 JPEG; the queue is cleared on any failure |
| Box printer client | `utils/printer/hw_printer.js` (19 to 35) | `rpc` to `default_printer_action` with `{action: "print_receipt", receipt}` or `{action: "cashbox"}` |
| Rasterize | `iot_handlers/drivers/printer_driver_base.py` `print_receipt` (71 to 83) | base64 decode, PIL `convert("L")`, `ImageOps.invert`, `convert("1")`, then `format_<protocol>` |
| ESC/POS image | `printer_driver_base.py` `format_escpos` (150 to 196), `format_escpos_bit_image_raster` (86 to 101), `format_escpos_bit_image_column` (113 to 148) | default `GS v 0` (`1d 76 30 00`) in slices of 255 rows; `ESC *` column mode when the printer name carries `__IMC_LDV_LDH_SCALE70__` style options |
| Star image | `printer_driver_L.py` `format_star` (70 to 84) | `ESC * r A`, page length, `b` + width + row bytes per line, `ESC * r B` |
| Command table | `printer_driver_base.py` `RECEIPT_PRINTER_COMMANDS` (20 to 33) | star: cut `1b 64 02`, drawers `07`, `1a`; escpos: cut `1d 56 41 0a`, drawers `1b 3d 01`, `1b 70 00 19 19`, `1b 70 01 19 19` |
| Drawer kick | `printer_driver_base.py` `open_cashbox` (198 to 204) | sends every drawer string in the table for the protocol |
| Spool | `printer_driver_L.py` (27, 49 to 58); `printer_driver_W.py` (49 to 59); `printer_driver_base.py` (18, 206 to 213) | `STR_T` in the device id means star, else escpos; CUPS `createJob` on Linux, `win32print` RAW on Windows; jobs polled every 1 s with a 30 s timeout |
| ePOS direct | `utils/printer/epson_printer.js` (28 to 37, 43 to 58, 63 to 66, 71 to 101) | POST to `/cgi-bin/epos/service.cgi?devid=local_printer`; body is `<image>` plus `<cut type="feed"/>`; the drawer is a bare `<pulse/>`; 15 s timeout; success read from `<response success>` |
| ePOS raster | `epson_printer.js` `canvasToRaster` (107 to 164), `encodeRaster` (169 to 176) | grayscale 0.299/0.587/0.114, Floyd-Steinberg dithering, 1 bit per pixel, base64; paper status bits `0x00080000` and `0x00020000` (7, 8) |
| Windows IoT | `windows_iot.rst`; `connect.rst` | Windows 10 or 11, installer into `C:\odoo`, homepage `http://localhost:8069`, firewall ports 8069, 80, 443; pairing by LAN scan, a two-hour pairing code, or a token |
| Money | `iot_box.rst`; odoo.com/app/iot-faq | subscription "required for production use of IoT gateways and generating the HTTPS certificate"; "US$ 30.00/month/box"; box "US$ 173.49" by region, "based on a Raspberry 4"; added "to the enterprise contract automatically" |
| What needs a box | `receipt_printers.rst` (10 to 17, 139 to 143); `devices/printer.rst` (11) | ePOS network Epson (TM-m30) works without a box; USB ePOS, plain ESC/POS, TM-T20 and TM-T88 need one; "The only way to connect a printer directly to an Odoo database is through the use of an IoT system" |

## What Jelly takes

1. The browser renders the receipt to a canvas and ships a raster, so the print path never depends on fonts on the bridge.
2. A thin LAN bridge with a hello route and a status route the register polls.
3. `GS v 0` raster as the default ESC/POS image command with `ESC *` as the fallback for old mechanisms.
4. Star raster as a second command set behind one interface.
5. The drawer kick goes through the receipt printer with `ESC p`.
6. Direct ePOS XML to Epson network printers as a no-bridge path, including `<pulse/>`.
7. Printer status bits (paper out, cover open) surface as plain messages at the register.

## What Jelly changes

1. Jelly ships no Pi product and no monthly bridge fee, because the box plus "US$ 30.00/month/box" is Odoo's revenue line and Jelly's price is already set.
2. The Jelly bridge is a small TypeScript service on any machine, because the Odoo proxy is a full Odoo process that pulls drivers from the server.
3. Jelly dithers once in the browser and sends 1-bit raster on both paths, because the box path sends a JPEG that PIL hard-thresholds with `convert("1")`, which loses grays and adds JPEG noise.
4. The bridge authenticates the register with a pairing secret, because `iot_route` sets `auth='none'` and `cors='*'`.
5. Status flows over a websocket from the bridge, replacing the 5 s poll.
6. Printers are named per station, because `default_printer_action` uses the first direct printer found.

## Clean-room line

Read for design on 2026-10-29; nothing copied; LGPL-3 forbids copying into Jelly. Names reused as facts only: `/hw_proxy/hello`, `/hw_proxy/status_json`, `GS v 0`, `ESC *`, `ESC p`.

## Open questions

- Where `/hw_proxy/handshake` is served; the client calls it and no route was found in `iot_drivers`.
- Whether the Enterprise `iot` app is required server side; `tools/helpers.py` (317) fetches `/iot/get_handlers` from the database and that route is in no community addon listed.
- Whether the Windows virtual IoT carries the same subscription; the FAQ page does not say.
