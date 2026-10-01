import React, { createContext, useContext, useEffect, useState } from 'react';
import { WebsiteSettings } from '../types';
import { INITIAL_SETTINGS } from '../services/seedData';
import { fetchWebsiteSettings, saveWebsiteSettings } from '../services/db';

interface SettingsContextType {
  settings: WebsiteSettings;
  loading: boolean;
  updateSettings: (newSettings: Partial<WebsiteSettings>) => Promise<void>;
  reloadSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: INITIAL_SETTINGS,
  loading: true,
  updateSettings: async () => {},
  reloadSettings: async () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<WebsiteSettings>(INITIAL_SETTINGS);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await fetchWebsiteSettings();
      setSettings(data);
    } catch (e) {
      console.warn('Settings load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (newSettings: Partial<WebsiteSettings>) => {
    try {
      await saveWebsiteSettings(newSettings);
      setSettings((prev) => ({ ...prev, ...newSettings }));
    } catch (e) {
      console.error('Failed to update website settings:', e);
      throw e;
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        updateSettings: update,
        reloadSettings: load,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
