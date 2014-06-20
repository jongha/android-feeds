package net.mrlatte.feeds.activities;

import net.mrlatte.feeds.R;
import net.mrlatte.feeds.feeding.FeedProxy;
import net.mrlatte.feeds.util.NavigationDrawerFragment;
import android.app.Activity;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBar;
import android.support.v7.app.ActionBarActivity;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.ProgressBar;

public class Main extends ActionBarActivity implements
		NavigationDrawerFragment.NavigationDrawerCallbacks {

	/**
	 * Fragment managing the behaviors, interactions and presentation of the
	 * navigation drawer.
	 */
	private NavigationDrawerFragment mNavigationDrawerFragment;

	/**
	 * Used to store the last screen title. For use in
	 * {@link #restoreActionBar()}.
	 */
	private CharSequence mTitle;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		mNavigationDrawerFragment = (NavigationDrawerFragment) getSupportFragmentManager()
				.findFragmentById(R.id.navigation_drawer);

		mTitle = getTitle();

		// Set up the drawer.
		mNavigationDrawerFragment.setUp(R.id.navigation_drawer,
				(DrawerLayout) findViewById(R.id.drawer_layout));
	}

	@Override
	public void onNavigationDrawerItemSelected(int position) {
		// update the main content by replacing fragments

		String url = null;
		switch (position + 1) {
		case 1:
			url = getString(R.string.feed_url1);
			break;
		case 2:
			url = getString(R.string.feed_url2);
			break;
		case 3:
			url = getString(R.string.feed_url3);
			break;
		case 4:
			url = getString(R.string.feed_url4);
			break;
		case 5:
			url = getString(R.string.feed_url5);
			break;
		case 6:
			url = getString(R.string.feed_url6);
			break;
		case 7:
			url = getString(R.string.feed_url7);
			break;
		}

		FragmentManager fragmentManager = getSupportFragmentManager();
		fragmentManager
				.beginTransaction()
				.replace(
						R.id.container,
						PlaceholderFragment
								.newInstance(this, position + 1, url)).commit();
	}

	public boolean isConnected() {
		ConnectivityManager connMgr = (ConnectivityManager) getSystemService(Activity.CONNECTIVITY_SERVICE);
		NetworkInfo networkInfo = connMgr.getActiveNetworkInfo();
		if (networkInfo != null && networkInfo.isConnected())
			return true;
		else
			return false;
	}

	public void onSectionAttached(int number) {
		switch (number) {
		case 1:
			mTitle = getString(R.string.feed_name1);
			break;
		case 2:
			mTitle = getString(R.string.feed_name2);
			break;
		case 3:
			mTitle = getString(R.string.feed_name3);
			break;
		case 4:
			mTitle = getString(R.string.feed_name4);
			break;
		case 5:
			mTitle = getString(R.string.feed_name5);
			break;
		case 6:
			mTitle = getString(R.string.feed_name6);
			break;
		case 7:
			mTitle = getString(R.string.feed_name7);
			break;
		}
	}

	public void restoreActionBar() {
		ActionBar actionBar = getSupportActionBar();
		actionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_STANDARD);
		actionBar.setDisplayShowTitleEnabled(true);
		actionBar.setTitle(mTitle);
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		if (!mNavigationDrawerFragment.isDrawerOpen()) {
			// Only show items in the action bar relevant to this screen
			// if the drawer is not showing. Otherwise, let the drawer
			// decide what to show in the action bar.
			getMenuInflater().inflate(R.menu.main, menu);
			restoreActionBar();
			return true;
		}
		return super.onCreateOptionsMenu(menu);
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		// Handle action bar item clicks here. The action bar will
		// automatically handle clicks on the Home/Up button, so long
		// as you specify a parent activity in AndroidManifest.xml.
		int id = item.getItemId();
		if (id == R.id.action_settings) {
			return true;
		}
		return super.onOptionsItemSelected(item);
	}

	/**
	 * A placeholder fragment containing a simple view.
	 */
	public static class PlaceholderFragment extends Fragment {
		/**
		 * The fragment argument representing the section number for this
		 * fragment.
		 */
		private static final String ARG_SECTION_NUMBER = "section_number";
		private Activity activity;
		private String url;

		/**
		 * Returns a new instance of this fragment for the given section number.
		 */
		public static PlaceholderFragment newInstance(Activity activity,
				int sectionNumber, String mUrl) {

			PlaceholderFragment fragment = new PlaceholderFragment();
			Bundle args = new Bundle();
			args.putInt(ARG_SECTION_NUMBER, sectionNumber);

			fragment.setArguments(args);
			fragment.activity = activity;
			fragment.url = mUrl;

			return fragment;
		}

		public PlaceholderFragment() {
		}

		@Override
		public View onCreateView(LayoutInflater inflater, ViewGroup container,
				Bundle savedInstanceState) {

			View rootView = inflater.inflate(R.layout.fragment_main, container,
					false);

			// TextView textView = (TextView) rootView
			// .findViewById(R.id.section_label);
			//
			// textView.setText(Integer.toString(getArguments().getInt(
			// ARG_SECTION_NUMBER)));

			ListView lstFeed = (ListView) rootView.findViewById(R.id.lstFeed);

			if (url != null) {
				final FeedProxy feedHelper = new FeedProxy(this.activity,
						lstFeed,
						(ProgressBar) rootView.findViewById(R.id.progressBar));

				feedHelper
						.getFeed("http://apps.mrlatte.net/api/feeds.json?url="
								+ url);

				lstFeed.setOnItemClickListener(new AdapterView.OnItemClickListener() {

					@Override
					public void onItemClick(AdapterView<?> arg0, View arg1,
							int position, long arg3) {

						Intent browserIntent = new Intent(Intent.ACTION_VIEW,
								Uri.parse(feedHelper.getLink(position)));

						startActivity(browserIntent);

						// Object o = lv.getItemAtPosition(position);
						/*
						 * write you handling code like... String st =
						 * "sdcard/"; File f = new File(st+o.toString()); // do
						 * whatever u want to do with 'f' File object
						 */
					}
				});
			}

			return rootView;
		}

		@Override
		public void onAttach(Activity activity) {
			super.onAttach(activity);
			((Main) activity).onSectionAttached(getArguments().getInt(
					ARG_SECTION_NUMBER));
		}
	}
}
