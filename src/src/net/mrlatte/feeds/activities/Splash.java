package net.mrlatte.feeds.activities;

import net.mrlatte.feeds.R;
import net.mrlatte.feeds.R.layout;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;

public class Splash extends Activity {

	private static int SPLASH_TIME_OUT = 2500;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_splash);

		new Handler().postDelayed(new Runnable() {
			@Override
			public void run() {
				Intent intent = new Intent(Splash.this, Main.class);
				startActivity(intent);

				finish();
			}
		}, SPLASH_TIME_OUT);
	}
}
