import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';
import { Network } from '@capacitor/network';

export const initializeMobileCapabilities = async () => {
  // Only run on native platforms
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    // Set initial status bar based on current theme
    await updateStatusBarForTheme();

    // Hide splash screen after app loads
    await SplashScreen.hide();

    // Configure keyboard behavior
    await Keyboard.setAccessoryBarVisible({ isVisible: true });
    
    // Listen for keyboard events to adjust layout
    Keyboard.addListener('keyboardWillShow', info => {
      console.log('Keyboard will show with height:', info.keyboardHeight);
      // Adjust layout if needed by adding a CSS class
      document.body.classList.add('keyboard-open');
      // Set CSS variable for keyboard height
      document.documentElement.style.setProperty('--keyboard-height', `${info.keyboardHeight}px`);
    });

    Keyboard.addListener('keyboardWillHide', () => {
      console.log('Keyboard will hide');
      // Reset layout
      document.body.classList.remove('keyboard-open');
      document.documentElement.style.setProperty('--keyboard-height', '0px');
    });

    // Monitor network status
    Network.addListener('networkStatusChange', status => {
      console.log('Network status changed', status);
      
      // Dispatch custom event for network status changes
      window.dispatchEvent(new CustomEvent('networkStatusChange', { 
        detail: status 
      }));
      
      // Update online/offline status
      if (status.connected) {
        window.dispatchEvent(new Event('online'));
      } else {
        window.dispatchEvent(new Event('offline'));
      }
    });

    // Status bar now uses Android's native theme - no need to observe changes

  } catch (error) {
    console.error('Error initializing mobile capabilities:', error);
  }
};

export const updateStatusBarForTheme = async () => {
  if (!Capacitor.isNativePlatform()) return;
  
  try {
    // Don't overlay content - give status bar its own space
    await StatusBar.setOverlaysWebView({ overlay: false });
    
    // Use Android's default system style - automatically adapts to device theme
    await StatusBar.setStyle({ 
      style: Style.Default 
    });
    
    // Do NOT set backgroundColor for Android - let it use native theme
    // The Android system will handle the color based on the device theme
    
  } catch (error) {
    console.error('Error updating status bar:', error);
  }
};

export const isNativePlatform = () => Capacitor.isNativePlatform();
export const getPlatform = () => Capacitor.getPlatform();

// Camera utilities
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export const takePhoto = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });
    return image.dataUrl;
  } catch (error) {
    console.error('Error taking photo:', error);
    return null;
  }
};

export const pickPhoto = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    });
    return image.dataUrl;
  } catch (error) {
    console.error('Error picking photo:', error);
    return null;
  }
};

// Share utilities
import { Share } from '@capacitor/share';

export const shareContent = async (title: string, text: string, url?: string) => {
  try {
    await Share.share({
      title,
      text,
      url,
      dialogTitle: 'Share',
    });
  } catch (error) {
    console.error('Error sharing:', error);
  }
};

// Network utilities
export const getNetworkStatus = async () => {
  try {
    const status = await Network.getStatus();
    return status;
  } catch (error) {
    console.error('Error getting network status:', error);
    return null;
  }
};
