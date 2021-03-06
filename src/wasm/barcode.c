#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <emscripten.h>
#include "quirc/quirc.h"

extern void jsPrintString(const char *s, uint16_t len);

// load rgba image and convert to grayscale
int load_img(struct quirc *qr, const uint8_t *img, int img_width, int img_height) {
  if (quirc_resize(qr, img_width, img_height) < 0) {
      return -1;
  }

  int w, h;
  uint8_t *image = quirc_begin(qr, &w, &h);
  int rgba_channel = 4;

  for (
			int dst_offset = 0, src_offset = 0;
			dst_offset < img_width * img_height;
			dst_offset++, src_offset += rgba_channel
		) {
			uint8_t r = img[src_offset];
			uint8_t g = img[src_offset + 1];
			uint8_t b = img[src_offset + 2];
			// convert RGB to grayscale, ignoring alpha channel if present, using this:
			// https://en.wikipedia.org/wiki/Grayscale#Colorimetric_(perceptual_luminance-preserving)_conversion_to_grayscale
			image[dst_offset] = (uint8_t)(0.2126 * (float)r + 0.7152 * (float)g + 0.0722 * (float)b);
		}

  return 0;
}

EMSCRIPTEN_KEEPALIVE
void decode_qr_code(uint8_t* img, int img_width, int img_height) {
  struct quirc *qr;
  char *str;
  unsigned short fail = 0;

  // initiate quirc instance
  qr = quirc_new();
  
	if (!qr) {
    str = "fail quirc_new()";
    fail = 1;
    goto out;
	}

  if(load_img(qr, img, img_width, img_height) == -1) {
    str = "fail quirc_new()";
    fail = 1;
    goto out;
  }

  quirc_end(qr);

  int count = quirc_count(qr);

  if (count < 0) {
    str = "fail quirc_count()";
    fail = 1;
		goto out;
	}

  struct quirc_code code;
  struct quirc_data data;
  quirc_decode_error_t err;

  quirc_extract(qr, 0, &code);

  err = quirc_decode(&code, &data);

  if (err == QUIRC_ERROR_DATA_ECC) {
      quirc_flip(&code);
      err = quirc_decode(&code, &data);
  }

  if (err) {
    str = (char *) quirc_strerror(err);
    fail = 1;
    goto out;
  }
  else {
    uint8_t *dataPayloadBuffer = malloc(sizeof(uint8_t) * QUIRC_MAX_PAYLOAD);
    uint8_t *dataPayloadBufferPtr = dataPayloadBuffer;
    uint8_t *dataPayloadPtr = data.payload;
    for (int j = 0; j < QUIRC_MAX_PAYLOAD; ++j) {
        *dataPayloadBufferPtr = *dataPayloadPtr;
        dataPayloadBufferPtr++;
        dataPayloadPtr++;
    }
    str = (char *) dataPayloadBuffer;
    fail = 0;
  }

out:
  if (qr != NULL) {
    quirc_destroy(qr);
  }

  char *result;

  if(fail == 1){
    char errCode[13] = "error_decode ";
    result = (char*) malloc(snprintf(NULL, 0, "%s %s", errCode, str) + 1);
    sprintf(result, "%s %s", errCode, str);

  } else {
    result = str;
  }

  jsPrintString(result, strlen(result));
}