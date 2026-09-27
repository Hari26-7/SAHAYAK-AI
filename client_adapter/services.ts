/**
 * MSME Sahayak AI - Frontend Client Services Adapter
 * Connects React / TypeScript UI to the Python FastAPI Backend
 */

export const API_BASE = "http://localhost:8000/api";

// 1. Schemes Service
export const schemesService = {
  async getAllSchemes() {
    const res = await fetch(`${API_BASE}/schemes`);
    if (!res.ok) throw new Error("Failed to fetch schemes");
    return await res.json();
  },

  async matchSchemes(profile: any, schemesList?: any[]) {
    const res = await fetch(`${API_BASE}/schemes/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile }),
    });
    if (!res.ok) throw new Error("Failed to match schemes");
    return await res.json();
  },
};

// 2. Applications Service
export const applicationsService = {
  async getApplications(userId: string) {
    const res = await fetch(`${API_BASE}/applications/user/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch applications");
    return await res.json();
  },

  async createApplication(userId: string, schemeId: string, schemeName: string, data: any = {}) {
    const res = await fetch(`${API_BASE}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        scheme_id: schemeId,
        scheme_name: schemeName,
        ...data,
      }),
    });
    if (!res.ok) throw new Error("Failed to submit application");
    return await res.json();
  },

  async deleteApplication(applicationId: string) {
    const res = await fetch(`${API_BASE}/applications/${applicationId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to withdraw application");
    return await res.json();
  },
};

// 3. Documents Service
export const documentsService = {
  async getDocuments(userId: string) {
    const res = await fetch(`${API_BASE}/documents/user/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch documents");
    return await res.json();
  },

  async uploadDocument(userId: string, file: File, documentType: string) {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("document_type", documentType);
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to upload document");
    return await res.json();
  },

  async deleteDocument(documentId: string) {
    const res = await fetch(`${API_BASE}/documents/${documentId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete document");
    return await res.json();
  },

  async updateVerificationStatus(documentId: string, status: string, remarks: string = "") {
    const res = await fetch(`${API_BASE}/documents/${documentId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, remarks }),
    });
    if (!res.ok) throw new Error("Failed to update status");
    return await res.json();
  },
};

// 4. Notifications Service
export const notificationsService = {
  async getNotifications(userId: string) {
    const res = await fetch(`${API_BASE}/notifications/user/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch notifications");
    return await res.json();
  },

  async createNotification(userId: string, type: string, title: string, message: string) {
    const res = await fetch(`${API_BASE}/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, type, title, message }),
    });
    if (!res.ok) throw new Error("Failed to create notification");
    return await res.json();
  },

  async markAsRead(notifId: string) {
    const res = await fetch(`${API_BASE}/notifications/${notifId}/read`, {
      method: "PUT",
    });
    if (!res.ok) throw new Error("Failed to mark as read");
    return await res.json();
  },

  async markAllAsRead(userId: string) {
    const res = await fetch(`${API_BASE}/notifications/user/${userId}/read-all`, {
      method: "PUT",
    });
    if (!res.ok) throw new Error("Failed to mark all as read");
    return await res.json();
  },

  async deleteNotification(notifId: string) {
    const res = await fetch(`${API_BASE}/notifications/${notifId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete notification");
    return await res.json();
  },
};

// 5. Eligibility Roadmap Service
export const roadmapService = {
  async getRoadmap(userId: string) {
    const res = await fetch(`${API_BASE}/roadmap/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch roadmap");
    return await res.json();
  },

  async createDefaultRoadmap(userId: string) {
    const res = await fetch(`${API_BASE}/roadmap/default/${userId}`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to initialize roadmap");
    return await res.json();
  },

  async updateStepStatus(stepId: string, status: string) {
    const res = await fetch(`${API_BASE}/roadmap/steps/${stepId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update roadmap step");
    return await res.json();
  },
};

// 6. Credit Profile Service
export const creditService = {
  calculateRating(score: number): string {
    if (score >= 750) return "Excellent";
    if (score >= 650) return "Good";
    if (score >= 550) return "Fair";
    return "Poor";
  },

  async getCreditProfile(userId: string) {
    const res = await fetch(`${API_BASE}/credit/${userId}`);
    if (!res.ok) return null;
    return await res.json();
  },

  async saveCreditProfile(data: any) {
    const res = await fetch(`${API_BASE}/credit/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to save credit profile");
    return await res.json();
  },
};

// 7. Scheme Stacking Service
export const stackingService = {
  async getStackingChecks(userId: string) {
    const res = await fetch(`${API_BASE}/stacking/${userId}`);
    if (!res.ok) return [];
    return await res.json();
  },

  async checkStacking(userId: string, selectedSchemes: any[]) {
    const res = await fetch(`${API_BASE}/stacking/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, schemes: selectedSchemes }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to check stacking compatibility");
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
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });
    if (!res.ok) throw new Error("Failed to update profile");
    return await res.json();
  },

  async upsertProfile(profileData: any) {
    const res = await fetch(`${API_BASE}/profiles/upsert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });
    if (!res.ok) throw new Error("Failed to upsert profile");
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
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, image_data: imageData }),
    });
    if (!res.ok) throw new Error("Failed to verify face");
    return await res.json();
  },
};
