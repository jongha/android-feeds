package net.mrlatte.feeds;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.os.AsyncTask;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;

public class FeedHelper {
	private Activity activity;
	private ListView listView;
	private ArrayAdapter<String> adapter;
	private ArrayList<String> listItems = new ArrayList<String>();
	private ArrayList<String> listLinks = new ArrayList<String>();

	public FeedHelper(Activity activity, ListView listView) {
		this.activity = activity;
		this.listView = listView;

		this.adapter = new ArrayAdapter<String>(activity.getBaseContext(),
				android.R.layout.simple_list_item_1, listItems);

		listView.setAdapter(adapter);
	}

	public String getLink(int index) {
		if (this.listLinks.size() > index) {
			return this.listLinks.get(index);
		}

		return null;
	}

	public void getFeed(String url) {
		new HttpAsyncTask().execute(url);
	}

	private String getData(String url) {
		InputStream inputStream = null;
		String result = "";

		try {
			// create HttpClient
			HttpClient httpclient = new DefaultHttpClient();

			// make GET request to the given URL
			HttpResponse httpResponse = httpclient.execute(new HttpGet(url));

			// receive response as inputStream
			inputStream = httpResponse.getEntity().getContent();

			// convert inputstream to string
			if (inputStream != null) {
				result = convertInputStreamToString(inputStream);
			} else {
				result = "";
			}

		} catch (Exception e) {
			// Log.d("InputStream", e.getLocalizedMessage());
		}

		return result;
	}

	private String convertInputStreamToString(InputStream inputStream)
			throws IOException {
		BufferedReader bufferedReader = new BufferedReader(
				new InputStreamReader(inputStream));
		String line = "";
		String result = "";
		while ((line = bufferedReader.readLine()) != null)
			result += line;

		inputStream.close();
		return result;

	}

	private class HttpAsyncTask extends AsyncTask<String, Void, String> {
		@Override
		protected String doInBackground(String... urls) {
			return getData(urls[0]);
		}

		@Override
		protected void onPostExecute(String result) {
			Toast.makeText(activity.getBaseContext(), "Received!",
					Toast.LENGTH_LONG).show();

			try {
				JSONObject obj = new JSONObject(result);
				JSONArray entries = (JSONArray) ((JSONObject) ((JSONObject) ((JSONObject) obj
						.get("output")).get("responseData")).get("feed"))
						.get("entries");

				for (int i = 0; i < entries.length(); ++i) {
					JSONObject entry = (JSONObject) entries.get(i);
					String title = (String) entry.get("title");
					String link = (String) entry.get("link");

					listItems.add(title);
					listLinks.add(link);

					adapter.notifyDataSetChanged();
				}

			} catch (JSONException e) {
				e.printStackTrace();
			}
			// etResponse.setText(result);
		}
	}
}
