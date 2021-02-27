#include <stdlib.h>
#include <string.h>
#include <emscripten.h>
#include "quirc/quirc.h"

struct nq_code_list {
	const char	*err; /* global error */
	struct nq_code	*codes;
	unsigned int	 size;
};

struct nq_code {
	const char		*err;
	struct quirc_code	 qcode;
	struct quirc_data	 qdata;
};

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

void
nq_code_list_free(struct nq_code_list *list)
{
	if (list != NULL) {
    free(list->codes);
  }
	free(list);
}

EMSCRIPTEN_KEEPALIVE
struct nq_code_list *
decode_qr_code(uint8_t* img, int img_width, int img_height) {
  struct nq_code_list *list = NULL;
  struct quirc *qr;

  char *str;

  str = "test sahaja";
  goto out;
  // allocate memory for list
  list = calloc(1, sizeof(struct nq_code_list));
	if (list == NULL) {
    str = "fail allocate list";
    goto out;
  }

  // initiate quirc instance
  qr = quirc_new();
  
	if (!qr) {
    str = "fail quirc_new()";
		list->err = "Error quirc_new()";
    goto out;
	}

  if(load_img(qr, img, img_width, img_height) == -1) {
    str = "fail load_img()";
    list->err = "Failed loading image";
    goto out;
  }

  quirc_end(qr);

  int count = quirc_count(qr);
  if (count < 0) {
    str = "fail quirc_count()";
		list->err = "Error quirc_count()";
		goto out;
	}

  list->size  = (unsigned int)count;
  list->codes = calloc((size_t)list->size, sizeof(struct nq_code));

  if (list->codes == NULL) {
		nq_code_list_free(list);
		list = NULL;
    str = "fail calloc codes";
		goto out;
	}

  for (int i = 0; i < count; i++) {
    struct nq_code *nqcode = list->codes + i;
    quirc_decode_error_t err;

    quirc_extract(qr, i, &nqcode->qcode);

    /* Decoding stage */
    err = quirc_decode(&nqcode->qcode, &nqcode->qdata);
    if (err == QUIRC_ERROR_DATA_ECC) {
			quirc_flip(&nqcode->qcode);
			err = quirc_decode(&nqcode->qcode, &nqcode->qdata);
		}

    if (err) {
			nqcode->err = quirc_strerror(err);
    }

    str = "success";
  }

out:
  if (qr != NULL) {
    quirc_destroy(qr);
  }

  return (list);
}