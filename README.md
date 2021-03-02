# Barcode Reader jsQR and quirc (C with WASM) through Web Worker

This project is experimental and for educational purpose to see performance of WASM and JS for decode QR Code. Using:

1. quirc library from C language with Web Assembly
2. jsQR library using pure javascript
3. Svelte for UI Framework
4. Rollup for bundler
5. Decoder run through Web Worker, it is off main thread!

## Instalation

install dependencies and devDependencies
```sh
$ yarn install
```

build and start server for development in watch mode
```sh
$ yarn dev
```

Open [http://localhost:1001](http://localhost:1001) to see the website

build for production
```sh
$ yarn build
```

build for production and start server
```sh
$ yarn build:start
```

## Updating barcode.c code
You need to install emscripten to be able to compile the C code to .wasm format. Learn [HERE](https://emscripten.org/docs/getting_started/downloads.html).

After successfully install emscipten, run this script to compile the C code to wasm.

No optimization 
```sh
$ yarn build:wasm
```

Full optimization 
```sh
$ yarn build:wasm:prod
```

For optimization explanation, read [https://emscripten.org/docs/optimizing/Optimizing-Code.html#how-to-optimize-code](https://emscripten.org/docs/optimizing/Optimizing-Code.html#how-to-optimize-code)