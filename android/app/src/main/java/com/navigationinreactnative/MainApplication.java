package com.navigationinreactnative;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
//import com.reactnativenavigation.NavigationReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import com.oblador.vectoricons.VectorIconsPackage;

import com.reactnativenavigation.NavigationApplication;

import com.airbnb.android.react.maps.MapsPackage;

import com.imagepicker.ImagePickerPackage;


// public class MainApplication extends Application implements ReactApplication {

//   private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
//     @Override
//     public boolean getUseDeveloperSupport() {
//       return BuildConfig.DEBUG;
//     }

//     @Override
//     protected List<ReactPackage> getPackages() {
//       return Arrays.<ReactPackage>asList(
//           new MainReactPackage(),
 //           new VectorIconsPackage(),
   //         new VectorIconsPackage(),
//             new VectorIconsPackage(),
//             new NavigationReactPackage(),
//           new VectorIconsPackage()
//       );
//     }

//     @Override
//     protected String getJSMainModuleName() {
//       return "index";
//     }
//   };

//   @Override
//   public ReactNativeHost getReactNativeHost() {
//     return mReactNativeHost;
//   }

//   @Override
//   public void onCreate() {
//     super.onCreate();
//     SoLoader.init(this, /* native exopackage */ false);
//   }
// }

public class MainApplication extends NavigationApplication {

	@Override
	public boolean isDebug() {
		// Make sure you are using BuildConfig from your own application
		return BuildConfig.DEBUG;
	}

	protected List<ReactPackage> getPackages() {
		// Add additional packages you require here
		// No need to add RnnPackage and MainReactPackage
		return Arrays.<ReactPackage>asList(
			// eg. new VectorIconsPackage()
      		new VectorIconsPackage(),
            new MapsPackage(),
			new ImagePickerPackage() // <-- add this line
            // OR if you want to customize dialog style
            //new ImagePickerPackage(R.style.my_dialog_style)
		);
	}

	@Override
	public List<ReactPackage> createAdditionalReactPackages() {
		return getPackages();
	}

  @Override
  public String getJSMainModuleName() {
	  return "index";
  }

//    @Override
//     protected List<ReactPackage> getPackages() {
//         return Arrays.<ReactPackage>asList(
//                 new MainReactPackage(),
//                 new MapsPackage()
//         );
//     }

}
