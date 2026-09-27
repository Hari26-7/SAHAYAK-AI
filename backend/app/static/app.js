/**
 * MSME Sahayak AI - Browser Application Controller
 */

const API_BASE = '/api';
const CURRENT_USER_ID = 'user_2bd27b1c4c'; // Demo user

let allSchemes = [];
let selectedStackingIds = [];
let roadmapSteps = [];

// Initialize on Load
document.addEventListener('DOMContentLoaded', async () => {
  setupNavigation();
  setupEventListeners();
  await loadInitialData();
});

// Toast notification
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.style.borderColor = isError ? '#ef4444' : '#4f46e5';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// Tab navigation
function setupNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
    });
  });
}

function switchTab(tabName) {
  document.querySelectorAll('.nav-btn').forEach((b) => b.classList.remove('active'));
  document.querySelectorAll('.tab-view').forEach((v) => v.classList.remove('active'));

  const targetBtn = document.querySelector(`.nav-btn[data-tab="${tabName}"]`);
  const targetTab = document.getElementById(`tab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);

  if (targetBtn) targetBtn.classList.add('active');
  if (targetTab) targetTab.classList.add('active');
}

// Initial Data Loading
async function loadInitialData() {
  try {
    await Promise.all([
      loadSchemes(),
      loadRoadmap(),
      loadApplications(),
      loadSheetsStatus()
    ]);
  } catch (err) {
    console.error('Initialization error:', err);
  }
}

// 1. SCHEMES
async function loadSchemes() {
  try {
    const res = await fetch(`${API_BASE}/schemes`);
    allSchemes = await res.json();
    document.getElementById('statSchemes').textContent = allSchemes.length;
    renderSchemes(allSchemes);
    renderStackingSelectors(allSchemes);
  } catch (err) {
    showToast('Failed to load schemes', true);
  }
}

function renderSchemes(schemes) {
  const container = document.getElementById('schemesGrid');
  if (!schemes || schemes.length === 0) {
    container.innerHTML = '<div style="color: #64748b;">No schemes found matching criteria.</div>';
    return;
  }

  container.innerHTML = schemes.map((s) => `
    <div class="scheme-card">
      <div>
        <div class="scheme-category">${escapeHtml(s.category)}</div>
        <div class="scheme-name">${escapeHtml(s.name)}</div>
        <div class="scheme-desc">${escapeHtml(s.description)}</div>
      </div>
      <div>
        <div class="scheme-meta">
          <div>
            <div style="font-size: 11px; color: #64748b;">MAX BENEFIT</div>
            <div style="font-weight: 700; color: #34d399;">₹${(s.max_benefit_amount || 0).toLocaleString('en-IN')}</div>
          </div>
          <div>
            <div style="font-size: 11px; color: #64748b;">SUBSIDY</div>
            <div style="font-weight: 700; color: #818cf8;">${s.subsidy_percent || 0}%</div>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-primary" style="flex: 1;" onclick="applyForScheme('${s.id}', '${escapeAttr(s.name)}')">Apply Now</button>
          ${s.application_link ? `<a href="${s.application_link}" target="_blank" class="btn btn-secondary" style="padding: 10px 14px;">Portal ↗</a>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

// 2. AI SCHEME MATCHER
async function runSchemeMatching() {
  const profile = {
    business_type: document.getElementById('matchBusinessType').value,
    sector: document.getElementById('matchSector').value,
    investment_amount: parseFloat(document.getElementById('matchInvestment').value) || 0,
    annual_turnover: parseFloat(document.getElementById('matchTurnover').value) || 0,
    state: document.getElementById('matchState').value,
  };

  const btn = document.getElementById('btnRunMatch');
  btn.disabled = true;
  btn.textContent = 'Evaluating AI Match...';

  try {
    const res = await fetch(`${API_BASE}/schemes/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile }),
    });

    const matches = await res.json();
    renderMatchResults(matches);
    showToast('AI Scheme Matching evaluated successfully!');
  } catch (err) {
    showToast('Failed to match schemes', true);
  } finally {
    btn.disabled = false;
    btn.textContent = '🎯 Match Eligible Schemes';
  }
}

function renderMatchResults(matches) {
  const container = document.getElementById('matchResultsContainer');
  if (!matches || matches.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <h3 style="font-size: 18px; font-weight: 700; margin: 28px 0 16px;">Top Recommended Matches for Your Profile:</h3>
    <div style="display: flex; flex-direction: column; gap: 16px;">
      ${matches.map((m) => `
        <div class="card" style="margin: 0;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
            <div>
              <div style="font-size: 12px; color: #818cf8; font-weight: 700; text-transform: uppercase;">${escapeHtml(m.scheme.category)}</div>
              <h4 style="font-size: 17px; font-weight: 700; color: #fff; margin-top: 4px;">${escapeHtml(m.scheme.name)}</h4>
            </div>
            <div style="text-align: right;">
              <span class="badge ${m.score >= 80 ? 'badge-success' : 'badge-primary'}" style="font-size: 14px; padding: 6px 14px;">
                ${m.score}% Match
              </span>
            </div>
          </div>
          <div class="match-bar" style="height: 8px; margin-bottom: 14px;">
            <div class="match-fill" style="width: ${m.score}%;"></div>
          </div>
          <div style="background: rgba(15, 23, 42, 0.6); padding: 12px 16px; border-radius: var(--radius-sm); margin-bottom: 14px;">
            <div style="font-size: 12px; font-weight: 700; color: #94a3b8; margin-bottom: 6px;">MATCH EXPLANATION:</div>
            <ul style="padding-left: 18px; font-size: 13px; color: #cbd5e1; line-height: 1.6;">
              ${m.reasons.map((r) => `<li>${escapeHtml(r)}</li>`).join('')}
            </ul>
          </div>
          <button class="btn btn-primary" onclick="applyForScheme('${m.scheme.id}', '${escapeAttr(m.scheme.name)}')">Apply with Profile Pre-Fill</button>
        </div>
      `).join('')}
    </div>
  `;
}

// 3. SCHEME STACKING
function renderStackingSelectors(schemes) {
  const container = document.getElementById('stackingSelectorList');
  container.innerHTML = schemes.map((s) => `
    <div class="selectable-box ${selectedStackingIds.includes(s.id) ? 'selected' : ''}" onclick="toggleStackScheme('${s.id}')">
      <div>
        <div style="font-weight: 600; color: #fff; font-size: 14px;">${escapeHtml(s.name)}</div>
        <div style="font-size: 12px; color: #94a3b8;">${escapeHtml(s.category)} • Cap: ₹${(s.max_benefit_amount || 0).toLocaleString('en-IN')}</div>
      </div>
      <div>
        <span class="badge ${selectedStackingIds.includes(s.id) ? 'badge-primary' : 'badge-warning'}">
          ${selectedStackingIds.includes(s.id) ? 'Selected' : '+ Select'}
        </span>
      </div>
    </div>
  `).join('');
}

function toggleStackScheme(id) {
  if (selectedStackingIds.includes(id)) {
    selectedStackingIds = selectedStackingIds.filter((x) => x !== id);
  } else {
    selectedStackingIds.push(id);
  }
  renderStackingSelectors(allSchemes);
}

async function checkStackingCompatibility() {
  if (selectedStackingIds.length < 2) {
    showToast('Please select at least 2 schemes to check compatibility', true);
    return;
  }

  const selected = allSchemes
    .filter((s) => selectedStackingIds.includes(s.id))
    .map((s) => ({ id: s.id, name: s.name }));

  try {
    const res = await fetch(`${API_BASE}/stacking/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: CURRENT_USER_ID, schemes: selected }),
    });

    const result = await res.json();
    renderStackingResult(result);
    showToast('Stacking rules verified & saved to Google Sheet!');
  } catch (err) {
    showToast('Failed to check stacking', true);
  }
}

function renderStackingResult(result) {
  const card = document.getElementById('stackingResultCard');
  card.style.display = 'block';

  const isCompatible = result.status === 'Compatible';
  const isConflict = result.status === 'Conflict Detected';

  card.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <div>
        <span class="badge ${isCompatible ? 'badge-success' : isConflict ? 'badge-danger' : 'badge-warning'}" style="font-size: 13px; padding: 6px 14px;">
          ${escapeHtml(result.status)}
        </span>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 11px; color: #64748b;">COMBINED BENEFIT CAP</div>
        <div style="font-size: 20px; font-weight: 800; color: #34d399;">₹${(result.total_potential_benefit || 0).toLocaleString('en-IN')}</div>
      </div>
    </div>

    ${result.conflict_notes && result.conflict_notes.length > 0 ? `
      <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); padding: 14px; border-radius: var(--radius-sm); margin-bottom: 14px;">
        <div style="font-weight: 700; color: #f87171; font-size: 13px; margin-bottom: 6px;">POLICY CONFLICT RESTRICTION:</div>
        <ul style="padding-left: 18px; font-size: 13px; color: #fca5a5; line-height: 1.5;">
          ${result.conflict_notes.map((c) => `<li>${escapeHtml(c)}</li>`).join('')}
        </ul>
      </div>
    ` : ''}

    <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); padding: 14px; border-radius: var(--radius-sm);">
      <div style="font-weight: 700; color: #34d399; font-size: 13px; margin-bottom: 6px;">STRATEGIC RECOMMENDATION:</div>
      <ul style="padding-left: 18px; font-size: 13px; color: #cbd5e1; line-height: 1.5;">
        ${result.recommendations.map((r) => `<li>${escapeHtml(r)}</li>`).join('')}
      </ul>
    </div>
  `;
}

// 4. ROADMAP
async function loadRoadmap() {
  try {
    const res = await fetch(`${API_BASE}/roadmap/${CURRENT_USER_ID}`);
    roadmapSteps = await res.json();
    renderRoadmap(roadmapSteps);
  } catch (err) {
    console.error('Roadmap error:', err);
  }
}

function renderRoadmap(steps) {
  const container = document.getElementById('roadmapStepsList');
  const completed = steps.filter((s) => s.status === 'completed').length;
  const pct = steps.length > 0 ? Math.round((completed / steps.length) * 100) : 0;

  // Update progress bars
  document.getElementById('roadmapProgressBar').style.width = `${pct}%`;
  document.getElementById('roadmapProgressBadge').textContent = `${completed}/${steps.length} (${pct}%) Completed`;
  document.getElementById('dashboardProgressBar').style.width = `${pct}%`;
  document.getElementById('dashboardProgressText').textContent = `${completed} of ${steps.length} milestone steps completed`;
  document.getElementById('statRoadmap').textContent = `${completed}/${steps.length}`;

  container.innerHTML = steps.map((s) => `
    <div style="display: flex; gap: 16px; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.06); align-items: center;">
      <div style="width: 36px; height: 36px; border-radius: 50%; background: ${s.status === 'completed' ? '#10b981' : 'rgba(255,255,255,0.08)'}; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff;">
        ${s.status === 'completed' ? '✓' : s.step_number}
      </div>
      <div style="flex: 1;">
        <div style="font-weight: 700; font-size: 15px; color: #fff;">${escapeHtml(s.title)}</div>
        <div style="font-size: 13px; color: #94a3b8; margin-top: 3px;">${escapeHtml(s.description)}</div>
      </div>
      <div>
        <button class="btn ${s.status === 'completed' ? 'btn-secondary' : 'btn-primary'}" onclick="toggleRoadmapStep('${s.id}', '${s.status}')">
          ${s.status === 'completed' ? 'Completed' : 'Mark Done'}
        </button>
      </div>
    </div>
  `).join('');
}

async function toggleRoadmapStep(stepId, currentStatus) {
  const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
  try {
    await fetch(`${API_BASE}/roadmap/steps/${stepId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });
    await loadRoadmap();
    showToast(`Step status updated to ${nextStatus}!`);
  } catch (err) {
    showToast('Failed to update step', true);
  }
}

// 5. CREDIT SCORE
function updateCreditScoreUI(val) {
  document.getElementById('creditScoreDisplay').textContent = val;
  const ratingBadge = document.getElementById('creditRatingBadge');

  if (val >= 750) {
    ratingBadge.textContent = 'Excellent';
    ratingBadge.style.color = '#34d399';
  } else if (val >= 650) {
    ratingBadge.textContent = 'Good';
    ratingBadge.style.color = '#818cf8';
  } else if (val >= 550) {
    ratingBadge.textContent = 'Fair';
    ratingBadge.style.color = '#fbbf24';
  } else {
    ratingBadge.textContent = 'Poor';
    ratingBadge.style.color = '#f87171';
  }
}

async function saveCreditProfile() {
  const score = parseInt(document.getElementById('creditScoreSlider').value);
  const payload = {
    user_id: CURRENT_USER_ID,
    credit_score: score,
    outstanding_loans: parseFloat(document.getElementById('creditOutstanding').value) || 0,
    annual_income: 1500000,
    existing_emis: parseFloat(document.getElementById('creditEMIs').value) || 0,
    banking_partner: document.getElementById('creditBank').value,
    gst_registered: document.getElementById('creditGST').checked,
    itr_filed: document.getElementById('creditITR').checked,
  };

  try {
    await fetch(`${API_BASE}/credit/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    showToast('Credit health profile saved to Google Sheet!');
  } catch (err) {
    showToast('Failed to save credit profile', true);
  }
}

// 6. APPLICATIONS
async function applyForScheme(schemeId, schemeName) {
  try {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: CURRENT_USER_ID,
        scheme_id: schemeId,
        scheme_name: schemeName,
        applied_via: 'MSME Sahayak AI Web Portal',
        business_name: 'Kumar Agro Innovations',
      }),
    });

    const app = await res.json();
    showToast(`Application submitted! Ref: ${app.application_reference}`);
    await loadApplications();
    switchTab('applications');
  } catch (err) {
    showToast('Failed to submit application', true);
  }
}

async function loadApplications() {
  try {
    const res = await fetch(`${API_BASE}/applications/user/${CURRENT_USER_ID}`);
    const apps = await res.json();
    document.getElementById('statApps').textContent = apps.length;
    renderApplications(apps);
  } catch (err) {
    console.error('Applications load error:', err);
  }
}

function renderApplications(apps) {
  const container = document.getElementById('applicationsTableContainer');
  if (!apps || apps.length === 0) {
    container.innerHTML = '<div style="color: #64748b; padding: 20px 0;">No active applications yet. Browse schemes or match your profile to apply.</div>';
    return;
  }

  container.innerHTML = `
    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
      <thead>
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8; font-size: 12px; text-transform: uppercase;">
          <th style="padding: 12px 14px;">Reference No.</th>
          <th style="padding: 12px 14px;">Scheme Name</th>
          <th style="padding: 12px 14px;">Applied Date</th>
          <th style="padding: 12px 14px;">Status</th>
          <th style="padding: 12px 14px;">Action</th>
        </tr>
      </thead>
      <tbody>
        ${apps.map((a) => `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <td style="padding: 14px; font-weight: 700; color: #818cf8; font-family: monospace;">${escapeHtml(a.application_reference)}</td>
            <td style="padding: 14px; font-weight: 600; color: #fff;">${escapeHtml(a.scheme_name)}</td>
            <td style="padding: 14px; color: #94a3b8; font-size: 13px;">${new Date(a.applied_date).toLocaleDateString()}</td>
            <td style="padding: 14px;">
              <span class="badge badge-success">${escapeHtml(a.status)}</span>
            </td>
            <td style="padding: 14px;">
              <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px; color: #f87171;" onclick="withdrawApp('${a.id}')">Withdraw</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

async function withdrawApp(id) {
  if (!confirm('Withdraw this application?')) return;
  try {
    await fetch(`${API_BASE}/applications/${id}`, { method: 'DELETE' });
    showToast('Application withdrawn successfully');
    await loadApplications();
  } catch (err) {
    showToast('Failed to withdraw application', true);
  }
}

// 7. GOOGLE SHEETS STATUS
async function loadSheetsStatus() {
  try {
    const res = await fetch(`${API_BASE}/sheets/status`);
    const status = await res.json();

    document.getElementById('statSheetStatus').textContent = status.is_connected ? 'Connected' : 'Local Mirror';
    document.getElementById('sheetBadgeText').textContent = status.is_connected ? 'Google Sheet Active' : 'Sheets DB Ready';
    document.getElementById('sheetDetailTitle').textContent = `Google Sheet: ${status.sheet_title || 'MSME_Sahayak_Database'}`;
    document.getElementById('sheetDetailId').textContent = `Spreadsheet ID: ${status.sheet_id || '1rfT9LvjYD1FJQyqsVASVshZllne8lt1lEODQTgLqoIY'} (${status.storage_mode})`;

    const grid = document.getElementById('sheetsTableCountsGrid');
    if (status.table_counts) {
      grid.innerHTML = Object.entries(status.table_counts).map(([tbl, cnt]) => `
        <div class="stat-card" style="padding: 16px;">
          <div>
            <div style="font-size: 20px; font-weight: 800; color: #fff;">${cnt}</div>
            <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase;">tab: ${escapeHtml(tbl)}</div>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Sheets status error:', err);
  }
}

async function forceSyncSheets() {
  const btn = document.getElementById('btnSyncSheets');
  btn.disabled = true;
  btn.textContent = 'Syncing...';
  try {
    const res = await fetch(`${API_BASE}/sheets/sync`, { method: 'POST' });
    await res.json();
    await loadSheetsStatus();
    showToast('Synced with Google Sheet successfully!');
  } catch (err) {
    showToast('Sync request sent', false);
  } finally {
    btn.disabled = false;
    btn.textContent = '🔄 Force Cloud Sync';
  }
}

// Event Listeners
function setupEventListeners() {
  // Scheme search & filter
  const searchInput = document.getElementById('schemeSearchInput');
  const catFilter = document.getElementById('schemeCategoryFilter');
  const filterHandler = () => {
    const query = searchInput.value.toLowerCase();
    const cat = catFilter.value;
    const filtered = allSchemes.filter((s) => {
      const matchesQ = !query || s.name.toLowerCase().includes(query) || s.description.toLowerCase().includes(query);
      const matchesC = !cat || s.category === cat;
      return matchesQ && matchesC;
    });
    renderSchemes(filtered);
  };
  searchInput.addEventListener('input', filterHandler);
  catFilter.addEventListener('change', filterHandler);

  // Matcher
  document.getElementById('btnRunMatch').addEventListener('click', runSchemeMatching);

  // Stacking
  document.getElementById('btnCheckStacking').addEventListener('click', checkStackingCompatibility);

  // Credit score slider
  const slider = document.getElementById('creditScoreSlider');
  slider.addEventListener('input', (e) => updateCreditScoreUI(parseInt(e.target.value)));
  document.getElementById('btnSaveCredit').addEventListener('click', saveCreditProfile);

  // Sync sheets
  document.getElementById('btnSyncSheets').addEventListener('click', forceSyncSheets);
}

// Helpers
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
}
