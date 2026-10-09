import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  // 1. System Preferences State
  const [currency, setCurrency] = useState(() => localStorage.getItem('pref_currency') || 'INR (₹)');
  const [weightUnit, setWeightUnit] = useState(() => localStorage.getItem('pref_weight_unit') || 'kg');
  const [distanceUnit, setDistanceUnit] = useState(() => localStorage.getItem('pref_distance_unit') || 'km');
  const [dateFormat, setDateFormat] = useState(() => localStorage.getItem('pref_date_format') || 'DD MMM, YYYY');
  const [trackingPrefix, setTrackingPrefix] = useState(() => localStorage.getItem('pref_tracking_prefix') || 'TRK');
  const [timeZone, setTimeZone] = useState(() => localStorage.getItem('pref_timezone') || '(GMT+05:30) Asia/Kolkata');
  const [language, setLanguage] = useState(() => localStorage.getItem('pref_language') || 'English');

  // 2. Notification Preferences State
  const [enableEmailNotifs, setEnableEmailNotifs] = useState(() => {
    const saved = localStorage.getItem('pref_email_notifs');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [enablePushNotifs, setEnablePushNotifs] = useState(() => {
    const saved = localStorage.getItem('pref_push_notifs');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Derive Currency Symbol
  const currencySymbol = useMemo(() => {
    if (currency.includes('$')) return '$';
    if (currency.includes('€')) return '€';
    if (currency.includes('£')) return '£';
    return '₹';
  }, [currency]);

  // Save Settings Helper
  const updateSettings = (newSettings) => {
    if (newSettings.currency !== undefined) {
      setCurrency(newSettings.currency);
      localStorage.setItem('pref_currency', newSettings.currency);
    }
    if (newSettings.weightUnit !== undefined) {
      setWeightUnit(newSettings.weightUnit);
      localStorage.setItem('pref_weight_unit', newSettings.weightUnit);
    }
    if (newSettings.distanceUnit !== undefined) {
      setDistanceUnit(newSettings.distanceUnit);
      localStorage.setItem('pref_distance_unit', newSettings.distanceUnit);
    }
    if (newSettings.dateFormat !== undefined) {
      setDateFormat(newSettings.dateFormat);
      localStorage.setItem('pref_date_format', newSettings.dateFormat);
    }
    if (newSettings.trackingPrefix !== undefined) {
      setTrackingPrefix(newSettings.trackingPrefix);
      localStorage.setItem('pref_tracking_prefix', newSettings.trackingPrefix);
    }
    if (newSettings.timeZone !== undefined) {
      setTimeZone(newSettings.timeZone);
      localStorage.setItem('pref_timezone', newSettings.timeZone);
    }
    if (newSettings.language !== undefined) {
      setLanguage(newSettings.language);
      localStorage.setItem('pref_language', newSettings.language);
    }
    if (newSettings.enableEmailNotifs !== undefined) {
      setEnableEmailNotifs(newSettings.enableEmailNotifs);
      localStorage.setItem('pref_email_notifs', JSON.stringify(newSettings.enableEmailNotifs));
    }
    if (newSettings.enablePushNotifs !== undefined) {
      setEnablePushNotifs(newSettings.enablePushNotifs);
      localStorage.setItem('pref_push_notifs', JSON.stringify(newSettings.enablePushNotifs));
    }

    toast.success('Global application settings updated!');
  };

  // Helper function to format price based on selected currency
  const formatPrice = (amount) => {
    const num = Number(amount) || 0;
    if (currencySymbol === '₹') {
      return `₹${num.toLocaleString('en-IN')}`;
    }
    return `${currencySymbol}${num.toLocaleString('en-US')}`;
  };

  // Helper function to format weight
  const formatWeight = (rawWeight) => {
    if (!rawWeight) return `1.0 ${weightUnit}`;
    const val = parseFloat(rawWeight) || 1.0;
    if (weightUnit === 'lbs' && !rawWeight.includes('lbs')) {
      const lbsVal = (val * 2.20462).toFixed(1);
      return `${lbsVal} lbs`;
    }
    return `${val.toFixed(1)} ${weightUnit}`;
  };

  return (
    <SettingsContext.Provider
      value={{
        currency,
        currencySymbol,
        weightUnit,
        distanceUnit,
        dateFormat,
        trackingPrefix,
        timeZone,
        language,
        enableEmailNotifs,
        enablePushNotifs,
        updateSettings,
        formatPrice,
        formatWeight
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    // Fallback defaults if context is not yet loaded
    return {
      currency: 'INR (₹)',
      currencySymbol: '₹',
      weightUnit: 'kg',
      distanceUnit: 'km',
      dateFormat: 'DD MMM, YYYY',
      trackingPrefix: 'TRK',
      timeZone: '(GMT+05:30) Asia/Kolkata',
      language: 'English',
      enableEmailNotifs: true,
      enablePushNotifs: true,
      updateSettings: () => {},
      formatPrice: (amt) => `₹${amt}`,
      formatWeight: (w) => `${w}`
    };
  }
  return context;
};
