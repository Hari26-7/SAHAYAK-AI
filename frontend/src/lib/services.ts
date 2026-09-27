/**
 * MSME Sahayak AI - Frontend Client Services
 * Connects to Python FastAPI Backend (with Google Sheets DB)
 */

export const API_BASE = '/api';

// 1. Schemes Service
export const schemesService = {
  async getAllSchemes() {
    const res = await fetch(`${API_BASE}/schemes`);
    if (!res.ok) throw new Error('Failed to fetch schemes');
    return await res.json();
  },

  matchSchemes(profile: any, schemesList?: any[]) {
    // Client-side quick calculation + matches
    if (!schemesList || schemesList.length === 0) return [];
    const sector = (profile?.sector || '').toLowerCase();
    const inv = Number(profile?.investment_amount) || 0;

    const results = schemesList.map((scheme) => {
      let score = 50;
      const reasons: string[] = [];
      const sName = (scheme.name || '').toLowerCase();
      const sDesc = (scheme.description || '').toLowerCase();

      if (sector.includes('manufacturing') && (sName.includes('pmegp') || sName.includes('zed') || sDesc.includes('manufacturing'))) {
        score += 30;
        reasons.push('High priority match for Manufacturing sector');
      } else if (sector.includes('service') && sName.includes('mudra')) {
        score += 25;
        reasons.push('Eligible under Services sector priority credit');
      }

      if (inv > 0 && inv <= 1000000 && sName.includes('mudra')) {
        score += 18;
        reasons.push('Investment amount within Mudra collateral-free limit (₹10 Lakhs)');
      }

      if (inv <= 10000000 && sName.includes('pmegp')) {
        score += 15;
        reasons.push('Micro enterprise eligible for up to 35% margin money subsidy');
      }

      if (reasons.length === 0) {
        reasons.push('Standard MSME general eligibility satisfied');
      }

      return {
        scheme,
        score: Math.min(score, 98),
        reasons
      };
    });

    results.sort((a, b) => b.score - a.score);
    return results;
  },
};

// 2. Applications Service
export const applicationsService = {
  async getApplications(userId: string) {
    const res = await fetch(`${API_BASE}/applications/user/${userId}`);
    if (!res.ok) return [];
    return await res.json();
  },

  async createApplication(userId: string, schemeId: string, schemeName: string, data: any = {}) {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        scheme_id: schemeId,
        scheme_name: schemeName,
        ...data,
      }),
    });
    if (!res.ok) throw new Error('Failed to submit application');
    return await res.json();
  },

  async deleteApplication(applicationId: string) {
    const res = await fetch(`${API_BASE}/applications/${applicationId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to withdraw application');
    return await res.json();
  },
};

// 3. Documents Service
export const documentsService = {
  async getDocuments(userId: string) {
    const res = await fetch(`${API_BASE}/documents/user/${userId}`);
    if (!res.ok) return [];
    return await res.json();
  },

  async uploadDocument(userId: string, file: File, documentType: string) {
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('document_type', documentType);
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload document');
    return await res.json();
  },

  async deleteDocument(documentId: string) {
    const res = await fetch(`${API_BASE}/documents/${documentId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete document');
    return await res.json();
  },

  async updateVerificationStatus(documentId: string, status: string, remarks: string = '') {
    const res = await fetch(`${API_BASE}/documents/${documentId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, remarks }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return await res.json();
  },
};

// 4. Notifications Service
export const notificationsService = {
  async getNotifications(userId: string) {
    const res = await fetch(`${API_BASE}/notifications/user/${userId}`);
    if (!res.ok) return [];
    return await res.json();
  },

  async createNotification(userId: string, type: string, title: string, message: string, dateStr?: string) {
    const res = await fetch(`${API_BASE}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, type, title, message, reminder_date: dateStr }),
    });
    if (!res.ok) throw new Error('Failed to create notification');
    return await res.json();
  },

  async markAsRead(notifId: string) {
    const res = await fetch(`${API_BASE}/notifications/${notifId}/read`, {
      method: 'PUT',
    });
    if (!res.ok) throw new Error('Failed to mark as read');
    return await res.json();
  },

  async markAllAsRead(userId: string) {
    const res = await fetch(`${API_BASE}/notifications/user/${userId}/read-all`, {
      method: 'PUT',
    });
    if (!res.ok) throw new Error('Failed to mark all as read');
    return await res.json();
  },

  async deleteNotification(notifId: string) {
    const res = await fetch(`${API_BASE}/notifications/${notifId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete notification');
    return await res.json();
  },
};

// 5. Eligibility Roadmap Service
export const roadmapService = {
  async getRoadmap(userId: string) {
    const res = await fetch(`${API_BASE}/roadmap/${userId}`);
    if (!res.ok) return [];
    return await res.json();
  },

  async createDefaultRoadmap(userId: string) {
    const res = await fetch(`${API_BASE}/roadmap/default/${userId}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to create roadmap');
    return await res.json();
  },

  async updateStepStatus(stepId: string, status: string) {
    const res = await fetch(`${API_BASE}/roadmap/steps/${stepId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update step');
    return await res.json();
  },
};

// 6. Credit Service
export const creditService = {
  calculateRating(score: number): string {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 550) return 'Fair';
    return 'Poor';
  },

  async getCreditProfile(userId: string) {
    const res = await fetch(`${API_BASE}/credit/${userId}`);
    if (!res.ok) return null;
    return await res.json();
  },

  async saveCreditProfile(data: any) {
    const res = await fetch(`${API_BASE}/credit/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to save credit profile');
    return await res.json();
  },
};

// 7. Stacking Service
export const stackingService = {
  async getStackingChecks(userId: string) {
    const res = await fetch(`${API_BASE}/stacking/${userId}`);
    if (!res.ok) return [];
    return await res.json();
  },

  async checkStacking(userId: string, selectedSchemes: any[]) {
    const res = await fetch(`${API_BASE}/stacking/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, schemes: selectedSchemes }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to check stacking');
    }
    return await res.json();
  },
};

// 8. Profile Service
export const profileService = {
  async getProfile(userId: string) {
    const res = await fetch(`${API_BASE}/profiles/${userId}`);
    if (!res.ok) return null;
    return await res.json();
  },

  async updateProfile(userId: string, profileData: any) {
    const res = await fetch(`${API_BASE}/profiles/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return await res.json();
  },

  async upsertProfile(profileData: any) {
    const res = await fetch(`${API_BASE}/profiles/upsert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    if (!res.ok) throw new Error('Failed to upsert profile');
    return await res.json();
  },
};

// 9. Face Verification Service
export const faceVerificationService = {
  async getVerifications(userId: string) {
    const res = await fetch(`${API_BASE}/face/verifications/${userId}`);
    if (!res.ok) return [];
    return await res.json();
  },

  async verifyFace(userId: string, imageData: string) {
    const res = await fetch(`${API_BASE}/face/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, image_data: imageData }),
    });
    if (!res.ok) throw new Error('Failed to verify face');
    return await res.json();
  },

  async createVerification(userId: string, status: string, confidence: number, liveness: boolean, imageSnapshot?: string) {
    const res = await fetch(`${API_BASE}/face/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        status,
        confidence_score: confidence,
        image_data: imageSnapshot || ''
      }),
    });
    if (!res.ok) throw new Error('Failed to create verification');
    return await res.json();
  },
};
