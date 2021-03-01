# Barcode Reader jsQR and quirc (C with WASM) through Web Worker

This project is experimental and for educational purpose to see performance of WASM and JS for decode QR Code. Using:

1. quirc library from C language with Web Assembly
2. jsQR library using pure javascript
3. Svelte for UI
4. Rollup for bundler
5. Decoder run through Web Worker (using Comlink), so it is out off main thread.
