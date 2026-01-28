try:
    import qrcode
    QR_AVAILABLE = True
except ImportError:
    import logging
    logging.error("qrcode library not found. QR code generation will be disabled.")
    QR_AVAILABLE = False

import io
import base64

def generate_invoice_qr(invoice_id: str) -> str:
    """
    Generates a QR code for an invoice ID and returns it as a base64 string.
    """
    if not QR_AVAILABLE:
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==" # 1x1 transparent pixel fallback

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(f"kaziflow://invoice/{invoice_id}")
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    return f"data:image/png;base64,{img_str}"
