favicons = $(patsubst %,image/favicon_%.png,32 64)
logos = $(patsubst %,image/logo_%.png,128 152 180 192)

.PHONY: all
all: images

.PHONY: clean
clean:
	-rm $(favicons)
	-rm $(logos)

.PHONY: images
images: $(favicons) $(logos)

image/favicon_%.png: image/favicon.svg
	convert -resize $*x$* -background none $< $@

image/logo_%.png: image/logo.svg
	convert -resize $*x$* -background none $< $@

