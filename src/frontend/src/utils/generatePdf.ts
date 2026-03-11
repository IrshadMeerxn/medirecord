import type { PatientRecord } from "../backend.d";

function formatDate(timestamp: bigint): string {
  try {
    const ms = Number(timestamp) / 1_000_000;
    return new Date(ms).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function field(label: string, value: string): string {
  const display = value?.trim() || "—";
  return `
    <div class="field">
      <div class="field-label">${label}</div>
      <div class="field-value">${display}</div>
    </div>`;
}

export function generateAndDownloadPdf(record: PatientRecord, recordId: bigint): void {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Patient Record #${recordId.toString()} — ${record.patientName}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Georgia', serif;
      color: #1a2a3a;
      background: #ffffff;
      padding: 40px 50px;
    }

    /* ── Header ── */
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 3px solid #1a2a4a;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .header-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .header-logo {
      width: 36px;
      height: 36px;
      background: #2a7a8a;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 18px;
      font-weight: bold;
    }
    .header-title {
      font-size: 22px;
      font-weight: bold;
      color: #1a2a4a;
      letter-spacing: -0.5px;
    }
    .header-subtitle {
      font-size: 11px;
      color: #5a7a9a;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-top: 2px;
    }
    .header-meta {
      text-align: right;
      font-size: 11px;
      color: #5a7a9a;
      line-height: 1.7;
    }
    .record-id {
      font-size: 13px;
      font-weight: bold;
      color: #2a5a7a;
      background: #e6f3f8;
      padding: 2px 10px;
      border-radius: 20px;
      font-family: monospace;
      display: inline-block;
      margin-bottom: 4px;
    }

    /* ── Patient name banner ── */
    .patient-banner {
      background: linear-gradient(135deg, #1a2a4a 0%, #2a4a7a 100%);
      color: white;
      border-radius: 8px;
      padding: 18px 24px;
      margin-bottom: 24px;
    }
    .patient-banner-label {
      font-size: 10px;
      letter-spacing: 2px;
      text-transform: uppercase;
      opacity: 0.7;
      margin-bottom: 4px;
    }
    .patient-banner-name {
      font-size: 24px;
      font-weight: bold;
      letter-spacing: -0.5px;
    }
    .patient-banner-badges {
      margin-top: 8px;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .badge {
      background: rgba(255,255,255,0.18);
      border: 1px solid rgba(255,255,255,0.25);
      color: white;
      font-size: 11px;
      padding: 2px 10px;
      border-radius: 12px;
    }

    /* ── Sections ── */
    .section {
      margin-bottom: 20px;
      border: 1px solid #d6e4ef;
      border-radius: 8px;
      overflow: hidden;
    }
    .section-header {
      background: #f0f7fb;
      padding: 10px 16px;
      font-size: 11px;
      font-weight: bold;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #2a5a7a;
      border-bottom: 1px solid #d6e4ef;
    }
    .section-body {
      padding: 16px;
    }
    .fields-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px 24px;
    }
    .fields-grid.full {
      grid-template-columns: 1fr;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .field-label {
      font-size: 10px;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #7a9ab8;
      font-family: Arial, sans-serif;
    }
    .field-value {
      font-size: 13px;
      color: #1a2a3a;
      line-height: 1.5;
    }

    /* ── Footer ── */
    .footer {
      margin-top: 32px;
      padding-top: 12px;
      border-top: 1px solid #d6e4ef;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: #9ab8cc;
    }

    /* ── Print rules ── */
    @media print {
      body {
        padding: 20px 30px;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .patient-banner {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .section-header {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="header">
    <div class="header-brand">
      <div class="header-logo">+</div>
      <div>
        <div class="header-title">MediRecord</div>
        <div class="header-subtitle">Patient Medical Record</div>
      </div>
    </div>
    <div class="header-meta">
      <div class="record-id">Record #${recordId.toString()}</div>
      <div>Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
      <div>CONFIDENTIAL — For authorized use only</div>
    </div>
  </div>

  <!-- Patient banner -->
  <div class="patient-banner">
    <div class="patient-banner-label">Patient</div>
    <div class="patient-banner-name">${record.patientName || "—"}</div>
    <div class="patient-banner-badges">
      <span class="badge">${record.gender || "—"}</span>
      <span class="badge">DOB: ${record.dateOfBirth || "—"}</span>
      <span class="badge">Blood Type: ${record.bloodType || "—"}</span>
    </div>
  </div>

  <!-- Personal Information -->
  <div class="section">
    <div class="section-header">Personal Information</div>
    <div class="section-body">
      <div class="fields-grid">
        ${field("Full Name", record.patientName)}
        ${field("Date of Birth", record.dateOfBirth)}
        ${field("Gender", record.gender)}
        ${field("Blood Type", record.bloodType)}
      </div>
    </div>
  </div>

  <!-- Medical Details -->
  <div class="section">
    <div class="section-header">Medical Details</div>
    <div class="section-body">
      <div class="fields-grid full" style="margin-bottom:12px">
        ${field("Diagnosis", record.diagnosis)}
        ${field("Treatment Plan", record.treatment)}
      </div>
      <div class="fields-grid">
        ${field("Medications", record.medications)}
        ${field("Allergies", record.allergies)}
      </div>
    </div>
  </div>

  ${record.notes?.trim() ? `
  <!-- Doctor's Notes -->
  <div class="section">
    <div class="section-header">Doctor's Notes</div>
    <div class="section-body">
      <div class="fields-grid full">
        ${field("Notes", record.notes)}
      </div>
    </div>
  </div>` : ""}

  <!-- Record Information -->
  <div class="section">
    <div class="section-header">Record Information</div>
    <div class="section-body">
      <div class="fields-grid">
        ${field("Attending Physician", record.doctorName ? `Dr. ${record.doctorName}` : "—")}
        ${field("Record Date", formatDate(record.recordDate))}
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <span>MediRecord — Secure Medical Records System</span>
    <span>© 2026 caffeine.ai — Confidential Document</span>
  </div>

  <script>
    window.onload = function() {
      window.print();
      setTimeout(function() { window.close(); }, 500);
    };
  </script>
</body>
</html>`;

  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) {
    console.error("Popup blocked — unable to open print window");
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();
}
