// src/redux/slices/notificationSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationService } from '../../services/notification.service';
import * as Notifications from 'expo-notifications';

interface NotificationState {
  pushToken: string | null;
  permissionStatus: 'undetermined' | 'granted' | 'denied';
  isInitialized: boolean;
  notifications: Notifications.Notification[];
  unreadCount: number;
  badgeCount: number;
  settings: {
    appointments: boolean;
    messages: boolean;
    promotions: boolean;
  };
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  pushToken: null,
  permissionStatus: 'undetermined',
  isInitialized: false,
  notifications: [],
  unreadCount: 0,
  badgeCount: 0,
  settings: {
    appointments: true,
    messages: true,
    promotions: false,
  },
  loading: false,
  error: null,
};

/**
 * Async thunk to initialize notifications and get token
 */
export const initializeNotifications = createAsyncThunk(
  'notification/initialize',
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = await notificationService.requestPermissionsAndGetToken(userId);
      const isEnabled = await notificationService.areNotificationsEnabled();

      return {
        token,
        permissionStatus: isEnabled ? 'granted' : 'denied',
      };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to initialize notifications');
    }
  }
);

/**
 * Async thunk to deactivate device token
 */
export const deactivateDevice = createAsyncThunk(
  'notification/deactivate',
  async (userId: string, { rejectWithValue }) => {
    try {
      await notificationService.deactivateDeviceToken(userId);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to deactivate device');
    }
  }
);

/**
 * Async thunk to update badge count
 */
export const updateBadgeCount = createAsyncThunk(
  'notification/updateBadgeCount',
  async (count: number, { rejectWithValue }) => {
    try {
      await notificationService.setBadgeCount(count);
      return count;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to update badge count');
    }
  }
);

/**
 * Async thunk to clear all badges
 */
export const clearBadges = createAsyncThunk(
  'notification/clearBadges',
  async (_, { rejectWithValue }) => {
    try {
      await notificationService.clearBadges();
      return 0;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to clear badges');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setPushToken: (state, action: PayloadAction<string | null>) => {
      state.pushToken = action.payload;
    },

    setPermissionStatus: (state, action: PayloadAction<'undetermined' | 'granted' | 'denied'>) => {
      state.permissionStatus = action.payload;
    },

    addNotification: (state, action: PayloadAction<Notifications.Notification>) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },

    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.request.identifier === action.payload
      );
      if (notification && state.unreadCount > 0) {
        state.unreadCount -= 1;
      }
    },

    markAllNotificationsAsRead: (state) => {
      state.unreadCount = 0;
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      const index = state.notifications.findIndex(
        (n) => n.request.identifier === action.payload
      );
      if (index !== -1) {
        state.notifications.splice(index, 1);
      }
    },

    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },

    updateNotificationSettings: (
      state,
      action: PayloadAction<{ key: keyof NotificationState['settings']; value: boolean }>
    ) => {
      const { key, value } = action.payload;
      state.settings[key] = value;
    },

    setNotificationSettings: (
      state,
      action: PayloadAction<NotificationState['settings']>
    ) => {
      state.settings = action.payload;
    },

    setBadgeCount: (state, action: PayloadAction<number>) => {
      state.badgeCount = action.payload;
    },

    incrementBadgeCount: (state) => {
      state.badgeCount += 1;
    },

    decrementBadgeCount: (state) => {
      if (state.badgeCount > 0) {
        state.badgeCount -= 1;
      }
    },

    resetBadgeCount: (state) => {
      state.badgeCount = 0;
    },

    clearError: (state) => {
      state.error = null;
    },

    resetNotificationState: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      // Initialize notifications
      .addCase(initializeNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.pushToken = action.payload.token;
        state.permissionStatus = action.payload.permissionStatus as 'granted' | 'denied';
        state.isInitialized = true;
      })
      .addCase(initializeNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isInitialized = true;
      })

      // Deactivate device
      .addCase(deactivateDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deactivateDevice.fulfilled, (state) => {
        state.loading = false;
        state.pushToken = null;
        state.permissionStatus = 'undetermined';
      })
      .addCase(deactivateDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update badge count
      .addCase(updateBadgeCount.fulfilled, (state, action) => {
        state.badgeCount = action.payload;
      })
      .addCase(updateBadgeCount.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Clear badges
      .addCase(clearBadges.fulfilled, (state, action) => {
        state.badgeCount = action.payload;
      })
      .addCase(clearBadges.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setPushToken,
  setPermissionStatus,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification,
  clearAllNotifications,
  updateNotificationSettings,
  setNotificationSettings,
  setBadgeCount,
  incrementBadgeCount,
  decrementBadgeCount,
  resetBadgeCount,
  clearError,
  resetNotificationState,
} = notificationSlice.actions;

export default notificationSlice.reducer;
