"""Create fast WebP originals and card thumbnails for new Glisten photographs.

Usage from the website folder:
    python tools/optimize_images.py

The script scans assets/images for JPG/JPEG/PNG files, keeps the two school
logos unchanged, and creates matching .webp images plus lightweight copies
inside assets/images/thumbs. Existing WebP files are left untouched.
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
IMAGE_ROOT = ROOT / "assets" / "images"
LOGOS = {Path("logo.png"), Path("preparatory/logo-preparatory.png")}


def save_webp(source: Path) -> None:
    relative = source.relative_to(IMAGE_ROOT)
    if relative in LOGOS:
        return

    image = ImageOps.exif_transpose(Image.open(source))
    if image.mode not in ("RGB", "RGBA"):
        image = image.convert("RGBA" if "A" in image.getbands() else "RGB")

    max_width = 1600 if any(part in relative.parts for part in ("gallery", "events", "preparatory")) else 1800
    if image.width > max_width:
        new_height = round(image.height * max_width / image.width)
        image = image.resize((max_width, new_height), Image.Resampling.LANCZOS)

    full_path = source.with_suffix(".webp")
    image.save(full_path, "WEBP", quality=84, method=6, alpha_quality=92)

    thumbnail = image.copy()
    limits = (720, 720)
    if "trophies" in relative.parts:
        limits = (520, 680)
    if relative.name.startswith("agnes-"):
        limits = (480, 720)
    thumbnail.thumbnail(limits, Image.Resampling.LANCZOS)

    thumb_path = IMAGE_ROOT / "thumbs" / relative.with_suffix(".webp")
    thumb_path.parent.mkdir(parents=True, exist_ok=True)
    thumbnail.save(thumb_path, "WEBP", quality=76, method=6, alpha_quality=90)
    print(f"Created: {full_path.relative_to(ROOT)}")
    print(f"Created: {thumb_path.relative_to(ROOT)}")


def main() -> None:
    files = [
        path for path in IMAGE_ROOT.rglob("*")
        if path.is_file()
        and "thumbs" not in path.parts
        and path.suffix.lower() in {".jpg", ".jpeg", ".png"}
        and path.relative_to(IMAGE_ROOT) not in LOGOS
    ]
    if not files:
        print("No new JPG or PNG photographs were found.")
        return
    for path in files:
        save_webp(path)
    print("\nUse the generated .webp path in the website content file or HTML page.")


if __name__ == "__main__":
    main()
