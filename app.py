import streamlit as st
from fpdf import FPDF
from streamlit_drawable_canvas import st_canvas
from PIL import Image
import io
import os
from datetime import datetime

st.set_page_config(
    page_title="Republic Hall Fellow Portal | KNUST",
    page_icon="🏛️",
    layout="wide"
)

# Custom Styling in Republic Hall Green & Gold
st.markdown("""
    <style>
    .main-header {
        background: linear-gradient(90deg, #0b6623 0%, #074717 100%);
        padding: 1.5rem;
        border-radius: 12px;
        border-bottom: 4px solid #d4af37;
        color: white;
        text-align: center;
        margin-bottom: 1.5rem;
    }
    .preview-box {
        background-color: #ffffff;
        color: #111111;
        padding: 35px;
        border-radius: 8px;
        border: 1px solid #d1d5db;
        box-shadow: 0 8px 20px rgba(0,0,0,0.12);
        font-family: 'Times New Roman', Times, serif;
        line-height: 1.65;
    }
    </style>
""", unsafe_allow_html=True)

st.markdown("""
    <div class="main-header">
        <h2 style="margin:0; color:white;">KWAME NKRUMAH UNIVERSITY OF SCIENCE AND TECHNOLOGY</h2>
        <p style="margin:5px 0 0 0; color:#facc15; font-weight:bold; letter-spacing:1px;">
            OFFICE OF THE HALL COUNCIL — REPUBLIC HALL FELLOW APPLICATION PORTAL
        </p>
    </div>
""", unsafe_allow_html=True)

col_form, col_preview = st.columns([1, 1.15], gap="large")

with col_form:
    st.subheader("1. Applicant Information")
    full_name = st.text_input(
        "Full Name & Academic Title/Rank *", 
        placeholder="e.g., Dr. John Mensah, Senior Lecturer"
    )
    unit_dept = st.text_input(
        "College/Faculty/Department/Office/Center/etc. *", 
        placeholder="e.g., College of Engineering / Dept. of Mechanical Engineering"
    )
    
    c1, c2 = st.columns(2)
    with c1:
        phone = st.text_input("Phone Number *", placeholder="e.g., 0240000000")
    with c2:
        email = st.text_input("Email Address *", placeholder="e.g., jmensah@knust.edu.gh")
        
    app_date = st.date_input("Application Date", datetime.today())
    formatted_date = app_date.strftime("%B %d, %Y")

    st.subheader("2. Electronic Signature")
    sig_mode = st.radio(
        "Choose Signature Method:", 
        ["Draw Signature on Screen", "Upload Signature Image"], 
        horizontal=True
    )
    
    sig_pil_image = None
    if sig_mode == "Draw Signature on Screen":
        st.caption("Sign inside the box below using your finger, stylus, or mouse:")
        canvas_result = st_canvas(
            stroke_width=2,
            stroke_color="#000080",
            background_color="#ffffff",
            height=130,
            width=400,
            drawing_mode="freedraw",
            key="sig_canvas",
        )
        if canvas_result.image_data is not None:
            img = Image.fromarray(canvas_result.image_data.astype("uint8"), "RGBA")
            if img.getextrema()[3][1] > 0:
                sig_pil_image = img
    else:
        uploaded_sig = st.file_uploader("Upload Signature (PNG/JPG)", type=["png", "jpg", "jpeg"])
        if uploaded_sig:
            sig_pil_image = Image.open(uploaded_sig).convert("RGBA")

# Display values for live preview
disp_name = full_name.strip() if full_name.strip() else "[Full Name & Title]"
disp_unit = unit_dept.strip() if unit_dept.strip() else "[College/Faculty/Department/Office/Center/etc.]"
disp_phone = phone.strip() if phone.strip() else "[Phone Number]"
disp_email = email.strip() if email.strip() else "[Email Address]"
contact_str = f"{disp_phone} / {disp_email}"

# Concise 5-line paragraph covering Fellowship networking, alumni relations, student welfare, and closing hope
body_text = (
    "I write to formally express my interest in serving as a Fellow of Republic Hall, KNUST. "
    "I am eager to actively network and collaborate with other Fellows and past students (alumni) "
    "to advance the rich traditions, mentorship networks, and continuous development of the Hall. "
    "Furthermore, I am deeply committed to promoting student welfare, academic excellence, and a "
    "supportive residential community in close partnership with Hall Management. I thank you for "
    "your kind consideration and look forward to hearing favorably from you soon."
)

with col_preview:
    st.subheader("Live Letter Preview")
    st.markdown(f"""
        <div class="preview-box">
            <div style="text-align:center; border-bottom: 2px solid #0b6623; padding-bottom: 10px; margin-bottom: 18px;">
                <div style="font-size: 13pt; font-weight: bold; color: #111;">KWAME NKRUMAH UNIVERSITY OF SCIENCE AND TECHNOLOGY</div>
                <div style="font-size: 10.5pt; font-weight: bold; color: #0b6623;">OFFICE OF THE HALL COUNCIL — REPUBLIC HALL</div>
            </div>
            <p style="margin: 4px 0;"><strong>Date:</strong> {formatted_date}</p>
            <p style="margin: 4px 0;"><strong>To:</strong> The Hall Master/Warden, Republic Hall, KNUST, Kumasi</p>
            <p style="margin: 4px 0;"><strong>From:</strong> {disp_name}, {disp_unit}</p>
            <p style="margin: 14px 0 8px 0;">Dear Hall Master/Warden,</p>
            <p style="margin: 8px 0 14px 0; font-weight: bold; text-decoration: underline;">
                APPLICATION FOR FELLOWSHIP OF REPUBLIC HALL, KNUST
            </p>
            <p style="text-align: justify; margin-bottom: 24px;">{body_text}</p>
            <p style="margin-bottom: 4px;">Yours faithfully,</p>
            <div style="color: #0b6623; font-style: italic; margin: 12px 0;">
                {"[ ✓ Electronic Signature Attached ]" if sig_pil_image else "[ Signature Pending ]"}
            </div>
            <p style="margin: 0; font-weight: bold;">{disp_name}</p>
            <p style="margin: 0;">{disp_unit}, KNUST</p>
            <p style="margin: 0; font-size: 10pt; color: #444;">Contact: {contact_str}</p>
        </div>
    """, unsafe_allow_html=True)

def build_official_pdf():
    pdf = FPDF(orientation="P", unit="mm", format="A4")
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.add_page()
    pdf.set_margins(22, 18, 22)
    
    # 1. Crest Logo if present in repo
    for logo_file in ["logo.jpg", "logo.png", "image.jpg", "image.png"]:
        if os.path.exists(logo_file):
            pdf.image(logo_file, x=92, y=14, w=26)
            pdf.ln(28)
            break
    else:
        pdf.ln(6)

    # 2. Header Text
    pdf.set_font("Times", "B", 13)
    pdf.set_text_color(20, 20, 20)
    pdf.cell(0, 6, "KWAME NKRUMAH UNIVERSITY OF SCIENCE AND TECHNOLOGY", ln=True, align="C")
    
    pdf.set_font("Times", "B", 11)
    pdf.set_text_color(11, 102, 35)
    pdf.cell(0, 6, "OFFICE OF THE HALL COUNCIL - REPUBLIC HALL", ln=True, align="C")
    
    pdf.ln(3)
    y_line = pdf.get_y()
    pdf.set_draw_color(11, 102, 35)
    pdf.set_line_width(0.6)
    pdf.line(22, y_line, 188, y_line)
    pdf.ln(8)

    # 3. Address & Metadata
    pdf.set_text_color(0, 0, 0)
    
    def add_meta_row(label, val):
        pdf.set_font("Times", "B", 11)
        pdf.write(7, f"{label} ")
        pdf.set_font("Times", "", 11)
        pdf.write(7, f"{val}\n")

    add_meta_row("Date:", formatted_date)
    add_meta_row("To:", "The Hall Master/Warden, Republic Hall, KNUST, Kumasi")
    add_meta_row("From:", f"{disp_name}, {disp_unit}")
    pdf.ln(4)

    # 4. Salutation & Subject
    pdf.set_font("Times", "", 11.5)
    pdf.cell(0, 7, "Dear Hall Master/Warden,", ln=True)
    pdf.ln(2)
    
    pdf.set_font("Times", "BU", 11)
    pdf.cell(0, 8, "APPLICATION FOR FELLOWSHIP OF REPUBLIC HALL, KNUST", ln=True)
    pdf.ln(4)

    # 5. Body Paragraph (5-line concise paragraph)
    pdf.set_font("Times", "", 11.5)
    pdf.multi_cell(0, 7.2, body_text)
    pdf.ln(10)

    # 6. Sign-off & Signature Image
    pdf.cell(0, 7, "Yours faithfully,", ln=True)
    
    if sig_pil_image:
        bg = Image.new("RGB", sig_pil_image.size, (255, 255, 255))
        bg.paste(sig_pil_image, mask=sig_pil_image.split()[3])
        buf = io.BytesIO()
        bg.save(buf, format="PNG")
        buf.seek(0)
        pdf.ln(2)
        pdf.image(buf, x=22, w=45)
        pdf.ln(4)
    else:
        pdf.ln(16)

    pdf.set_font("Times", "B", 11.5)
    pdf.cell(0, 6, disp_name, ln=True)
    pdf.set_font("Times", "", 11)
    pdf.cell(0, 6, f"{disp_unit}, KNUST", ln=True)
    pdf.set_font("Times", "", 10.5)
    pdf.cell(0, 6, f"Contact: {contact_str}", ln=True)

    return bytes(pdf.output())

st.markdown("---")
# All fields (including email) and signature are now strictly required
is_complete = bool(
    full_name.strip
