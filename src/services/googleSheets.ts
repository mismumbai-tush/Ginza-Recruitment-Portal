import type { Candidate, JobRequisition, GoogleSheetConfig } from '../types/recruitment';
import { markCandidateSynced } from './db';

/**
 * Exact Candidate Tab Column Headers from User's Google Sheet
 */
export const CANDIDATE_EXACT_HEADERS = [
  "Timestamp", "Name", "Position Applying For", "Contact No.", "Email",
  "Education Qualification", "Current/ Last Company Name", "Notice Period",
  "Total Experience", "Current/ Last Salary/ CTC", "Expected Salary/ CTC",
  "Why looking to switch?", "Source", "Resume (Attach)", "Current Location (City, State)",
  "Source Category", "Unit", "Screening Status", "Screening Remarks",
  "Send Message to Unreachable", "Message Sent", "Position Month-Year",
  "1st Interview Date", "1st Interviewer Name", "1st Interview Status", "1st Interview Remarks",
  "2nd Interview Date", "2nd Interviewer Name", "2nd Interview Status", "2nd Interview Remarks",
  "3rd Interview Date", "3rd Interviewer Name", "3rd Interview Status", "3rd Interview Remarks",
  "Joining Date", "Offered Salary /  CTC", "Offer Negotiation Date", "Offer negotiation Status",
  "HR Discussion (Date)", "HR Remarks Status", "Offer Letter Share (Date)",
  "Offer Letter Acceptance (Date)", "Offer Letter (Status)", "Date of Joining",
  "Month of joining", "Joining Status", "Remarks", "Hiring/ Agency Charges"
];

/**
 * Exact MRF Tab Column Headers from User's Google Sheet
 */
export const MRF_EXACT_HEADERS = [
  "Required Position", "Unit/ Branch", "Timestamp", "Email Address", "Your Name",
  "Reason for Requisition", "Experience (Select all that apply)", "Highest Qualification",
  "CTC", "Expected Joining Date", "Preferred Gender",
  "Work Address (Unit work address with street number and pin code)",
  "Work Profile (Mention Key Roles)", "Required Skills", "Job Timing", "Attach JD (if any)",
  "Job Posted", "Posting Date", "Platforms Posted On", "CV Received", "CV Screened",
  "1st Round Interview", "2nd Round Interview", "3rd Round Interview",
  "Priority", "Status", "Status Timestamp", "Closed from (Source)", "Remarks", "TAT"
];

/**
 * Generates the full Apps Script code customized for the user's exact Google Sheet columns.
 */
export const generateGoogleAppsScriptCode = (): string => {
  return `/**
 * TalentPulse HR Recruitment ATS — Google Apps Script
 * ===================================================
 * Configured specifically for your Google Sheet tabs: "Candidates" & "MRF"
 * 
 * Instructions:
 *   1. In your Google Sheet, go to Extensions > Apps Script
 *   2. Delete any existing code, paste this ENTIRE code, and click Save 💾
 *   3. Click Deploy > New deployment > Type: Web App
 *   4. Execute as: Me  |  Who has access: Anyone
 *   5. Copy the Web App URL and paste it into the TalentPulse application!
 */

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var contents = JSON.parse(e.postData.contents);

    if (contents.event === 'requisition_sync') {
      var reqSheet = ss.getSheetByName("MRF") || ss.getSheetByName("Requisitions") || ss.insertSheet("MRF");
      if (reqSheet.getLastRow() === 0) {
        var mrfHeaders = ${JSON.stringify(MRF_EXACT_HEADERS)};
        reqSheet.appendRow(mrfHeaders);
        reqSheet.getRange(1, 1, 1, mrfHeaders.length)
          .setFontWeight("bold").setBackground("#4F46E5").setFontColor("#FFFFFF");
        reqSheet.setFrozenRows(1);
      }

      var req = contents.requisition;
      var reqRow = [
        req.title || "", req.unitBranch || "", req.createdAt || new Date().toISOString(),
        req.requesterEmail || "", req.requestedBy || "", req.reasonForRequisition || "",
        req.experienceYears || "", req.highestQualification || "", req.budgetSalary || "",
        req.expectedJoiningDate || "", req.preferredGender || "", req.location || "",
        req.responsibilities || "", (req.requiredSkills || []).join(", "), req.jobTiming || "",
        req.attachJd || "", "Yes", new Date().toLocaleDateString(), req.platformsPostedOn || "Portal",
        req.cvReceived || 0, req.cvScreened || 0, req.round1Count || 0, req.round2Count || 0,
        req.round3Count || 0, req.priority || "Medium", req.status || "Published",
        new Date().toISOString(), "", req.description || "", req.tat || "7 Days"
      ];

      var reqData = reqSheet.getDataRange().getValues();
      var reqRowIdx = -1;
      for (var r = 1; r < reqData.length; r++) {
        if (String(reqData[r][0]).trim().toLowerCase() === String(req.title).trim().toLowerCase()) {
          reqRowIdx = r + 1;
          break;
        }
      }

      if (reqRowIdx > 0) {
        reqSheet.getRange(reqRowIdx, 1, 1, reqRow.length).setValues([reqRow]);
      } else {
        reqSheet.appendRow(reqRow);
      }

      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "MRF synced" }))
        .setMimeType(ContentService.MimeType.JSON);
    } 
    else {
      var candSheet = ss.getSheetByName("Candidates") || ss.insertSheet("Candidates");
      if (candSheet.getLastRow() === 0) {
        var candHeaders = ${JSON.stringify(CANDIDATE_EXACT_HEADERS)};
        candSheet.appendRow(candHeaders);
        candSheet.getRange(1, 1, 1, candHeaders.length)
          .setFontWeight("bold").setBackground("#4F46E5").setFontColor("#FFFFFF");
        candSheet.setFrozenRows(1);
      }

      var c = contents.candidate;
      var evals = c.evaluations || [];
      var r1 = evals.find(function(ev) { return ev.roundName && ev.roundName.indexOf("Round 1") !== -1; });
      var r2 = evals.find(function(ev) { return ev.roundName && ev.roundName.indexOf("Round 2") !== -1; });
      var r3 = evals.find(function(ev) { return ev.roundName && ev.roundName.indexOf("Round 3") !== -1; });

      var candRow = [
        c.appliedDate || new Date().toISOString(), c.fullName || "", c.jobTitle || "",
        c.phone || "", c.email || "", c.educationQualification || c.education || "", c.currentCompany || "",
        c.noticePeriod || "", c.experienceYears || "", c.currentSalary || "",
        c.expectedSalary || "", c.switchReason || c.whyLookingToSwitch || "", c.source || "Web Portal",
        c.resumeFileName || "", c.location || "", c.sourceCategory || "Direct",
        c.unit || "", c.stage || "Applied", c.screeningRemarks || "Application received",
        "No", "Yes", new Date().toLocaleDateString("en-US", {month: 'short', year: 'numeric'}),
        r1 ? r1.evaluatedAt : "", r1 ? r1.interviewerName : "", r1 ? r1.recommendation : "", r1 ? r1.notes : "",
        r2 ? r2.evaluatedAt : "", r2 ? r2.interviewerName : "", r2 ? r2.recommendation : "", r2 ? r2.notes : "",
        r3 ? r3.evaluatedAt : "", r3 ? r3.interviewerName : "", r3 ? r3.recommendation : "", r3 ? r3.notes : "",
        c.joiningDate || "", c.offeredSalary || "", "", "", "", "", "", "",
        c.offerLetterStatus || "Pending", c.joiningDate || "", "", c.joiningStatus || "In Progress",
        c.remarks || "", ""
      ];

      var candData = candSheet.getDataRange().getValues();
      var candRowIdx = -1;
      for (var i = 1; i < candData.length; i++) {
        var sheetEmail = String(candData[i][4]).trim().toLowerCase();
        var sheetName = String(candData[i][1]).trim().toLowerCase();
        if ((sheetEmail && sheetEmail === String(c.email).trim().toLowerCase()) ||
            (sheetName && sheetName === String(c.fullName).trim().toLowerCase())) {
          candRowIdx = i + 1;
          break;
        }
      }

      if (candRowIdx > 0) {
        candSheet.getRange(candRowIdx, 1, 1, candRow.length).setValues([candRow]);
      } else {
        candSheet.appendRow(candRow);
      }

      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Candidate synced" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Read MRF Sheet
    var mrfSheet = ss.getSheetByName("MRF") || ss.getSheetByName("Requisitions") || ss.getSheets()[0];
    var mrfRows = [];
    if (mrfSheet && mrfSheet.getLastRow() > 1) {
      var mrfData = mrfSheet.getDataRange().getValues();
      var mrfHeaders = mrfData[0];
      for (var m = 1; m < mrfData.length; m++) {
        var mObj = {};
        for (var mh = 0; mh < mrfHeaders.length; mh++) {
          mObj[String(mrfHeaders[mh]).trim()] = mrfData[m][mh];
        }
        mrfRows.push(mObj);
      }
    }
    
    // Read Candidates Sheet
    var candSheet = ss.getSheetByName("Candidates") || ss.getSheets()[1] || ss.getSheets()[0];
    var candRows = [];
    if (candSheet && candSheet.getLastRow() > 1) {
      var candData = candSheet.getDataRange().getValues();
      var candHeaders = candData[0];
      for (var c = 1; c < candData.length; c++) {
        var cObj = {};
        for (var ch = 0; ch < candHeaders.length; ch++) {
          cObj[String(candHeaders[ch]).trim()] = candData[c][ch];
        }
        // Always bind Column A (index 0) to Timestamp and appliedDate
        if (candData[c][0] !== undefined && candData[c][0] !== null && String(candData[c][0]).trim() !== "") {
          cObj["Timestamp"] = String(candData[c][0]).trim();
          cObj["appliedDate"] = String(candData[c][0]).trim();
        }
        candRows.push(cObj);
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        mrf: mrfRows,
        candidates: candRows,
        totalMrf: mrfRows.length,
        totalCandidates: candRows.length
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;
};

/**
 * Sync Candidate to Google Sheet
 */
export const syncCandidateToGoogleSheet = async (
  candidate: Candidate,
  config?: GoogleSheetConfig
): Promise<{ success: boolean; message: string }> => {
  const webhookUrl = (config && config.webhookUrl && config.webhookUrl.trim()) 
    ? config.webhookUrl.trim() 
    : 'https://script.google.com/macros/s/AKfycbwUrDnuL5XfaRfB6pd-tw2xGyFnjPDzQxr_yPV41f2xcsyu25VLfl9qG1MdVO1KSAjwww/exec';

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'candidate_sync',
        candidate,
        timestamp: new Date().toISOString()
      }),
    });

    markCandidateSynced(candidate.id);
    return { success: true, message: `✅ Synced ${candidate.fullName} directly to Google Sheet!` };
  } catch (err: any) {
    console.error('Google Sheets Sync Error:', err);
    return { success: false, message: err.message || 'Failed to communicate with Google Sheets Webhook.' };
  }
};

/**
 * Sync Requisition (MRF) to Google Sheet
 */
export const syncRequisitionToGoogleSheet = async (
  requisition: JobRequisition,
  config?: GoogleSheetConfig
): Promise<{ success: boolean; message: string }> => {
  const webhookUrl = (config && config.webhookUrl && config.webhookUrl.trim()) 
    ? config.webhookUrl.trim() 
    : 'https://script.google.com/macros/s/AKfycbwUrDnuL5XfaRfB6pd-tw2xGyFnjPDzQxr_yPV41f2xcsyu25VLfl9qG1MdVO1KSAjwww/exec';

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'requisition_sync',
        requisition,
        timestamp: new Date().toISOString()
      }),
    });

    return { success: true, message: `✅ Synced MRF ${requisition.title} to Google Sheet!` };
  } catch (err: any) {
    console.error('MRF Google Sheets Sync Error:', err);
    return { success: false, message: err.message || 'Failed to communicate with Google Sheets Webhook.' };
  }
};

/**
 * Pull both MRF and Candidates data live from Google Sheet
 */
export const pullGoogleSheetData = async (
  config: GoogleSheetConfig
): Promise<{
  success: boolean;
  message: string;
  mrfRows?: Record<string, any>[];
  candidateRows?: Record<string, any>[];
}> => {
  if (!config.webhookUrl) {
    return { success: false, message: 'Webhook URL not configured. Please set up Google Apps Script.' };
  }

  try {
    const url = `${config.webhookUrl}?action=read&t=${Date.now()}`;
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();

    if (json.status === 'error') {
      return { success: false, message: json.message || 'Google Sheet returned an error.' };
    }

    return {
      success: true,
      message: `✅ Successfully pulled ${json.totalMrf || 0} MRF Requisitions and ${json.totalCandidates || 0} Candidates from your Google Sheet!`,
      mrfRows: json.mrf || [],
      candidateRows: json.candidates || []
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Unable to fetch live data: ${err.message}. Make sure Web App deployment has "Anyone" access.`
    };
  }
};

/**
 * Helper to match flexible column names in user's Google Sheet
 */
export const getValueByFlexibleKey = (row: Record<string, any>, possibleKeys: string[]): string => {
  const rowKeys = Object.keys(row);
  for (const key of possibleKeys) {
    const match = rowKeys.find(k => k.toLowerCase().replace(/[^a-z0-9]/g, '') === key.toLowerCase().replace(/[^a-z0-9]/g, ''));
    if (match && row[match] !== undefined && row[match] !== null && String(row[match]).trim() !== '') {
      return String(row[match]).trim();
    }
  }
  // Column A Fallback for Timestamp/Applied Date
  if (possibleKeys.includes('Timestamp') && rowKeys.length > 0) {
    const colAVal = row[rowKeys[0]];
    if (colAVal !== undefined && colAVal !== null && String(colAVal).trim() !== '') {
      return String(colAVal).trim();
    }
  }
  return '';
};

/**
 * Export candidate pipeline as CSV download
 */
export const exportCandidatesToCSV = (candidates: Candidate[]): void => {
  const headers = CANDIDATE_EXACT_HEADERS;

  const rows = candidates.map(c => {
    const r1 = c.evaluations.find(e => e.roundName.includes('Round 1'));
    const r2 = c.evaluations.find(e => e.roundName.includes('Round 2'));
    const r3 = c.evaluations.find(e => e.roundName.includes('Round 3'));

    return [
      c.appliedDate, `"${c.fullName}"`, `"${c.jobTitle}"`, `"${c.phone}"`, c.email,
      `"${c.education || 'N/A'}"`, `"${c.currentCompany || 'N/A'}"`, `"${c.noticePeriod}"`,
      c.experienceYears, `"${c.currentSalary || 'N/A'}"`, `"${c.expectedSalary}"`,
      `"${c.switchReason || 'N/A'}"`, `"${c.source || 'Web Portal'}"`, `"${c.resumeFileName}"`,
      `"${c.location || 'N/A'}"`, `"${c.sourceCategory || 'Direct'}"`, `"${c.unit || 'N/A'}"`,
      `"${c.stage}"`, `"${c.screeningRemarks || 'N/A'}"`, "No", "Yes", "",
      `"${r1 ? r1.evaluatedAt : ''}"`, `"${r1 ? r1.interviewerName : ''}"`, `"${r1 ? r1.recommendation : ''}"`, `"${r1 ? r1.notes : ''}"`,
      `"${r2 ? r2.evaluatedAt : ''}"`, `"${r2 ? r2.interviewerName : ''}"`, `"${r2 ? r2.recommendation : ''}"`, `"${r2 ? r2.notes : ''}"`,
      `"${r3 ? r3.evaluatedAt : ''}"`, `"${r3 ? r3.interviewerName : ''}"`, `"${r3 ? r3.recommendation : ''}"`, `"${r3 ? r3.notes : ''}"`,
      `"${c.joiningDate || 'N/A'}"`, `"${c.offeredSalary || 'N/A'}"`, "", "", "", "", "", "",
      `"${c.offerLetterStatus || 'Pending'}"`, `"${c.joiningDate || 'N/A'}"`, "", `"${c.joiningStatus || 'In Progress'}"`,
      `"${c.remarks || 'N/A'}"`, ""
    ].join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `TalentPulse_Candidates_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
