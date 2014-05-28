package net.mrlatte.feeds;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.os.AsyncTask;
import android.widget.ListView;
import android.widget.SimpleAdapter;
import android.widget.Toast;

public class FeedHelper {
	private Activity activity;
	private ListView listView;
	private SimpleAdapter adapter;
	private List<Map<String, String>> data = new ArrayList<Map<String, String>>();
//	private ArrayList<String> listItems = new ArrayList<String>();
//	private ArrayList<String> listLinks = new ArrayList<String>();
	private Toast toast;
	
	public FeedHelper(Activity activity, ListView listView) {
		this.activity = activity;
		this.listView = listView;

		this.adapter = new SimpleAdapter(activity.getBaseContext(), data,
                android.R.layout.simple_list_item_2,
                new String[] {"title", "date"},
                new int[] {android.R.id.text1,
                           android.R.id.text2});
		
		listView.setAdapter(adapter);
	}

	public String getLink(int index) {
		if (this.data.size() > index) {
			return this.data.get(index).get("link");
		}

		return null;
	}

	public void getFeed(String url) {
		toast = Toast.makeText(activity.getBaseContext(), "Loading...",
				Toast.LENGTH_SHORT);
		
		toast.show();
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
			try {
				JSONObject obj = new JSONObject(result);
				JSONArray entries = (JSONArray) ((JSONObject) ((JSONObject) ((JSONObject) obj
						.get("output")).get("responseData")).get("feed"))
						.get("entries");

				for (int i = 0; i < entries.length(); ++i) {
					JSONObject entry = (JSONObject) entries.get(i);
					Map<String, String> datum = new HashMap<String, String>(3);
				    datum.put("title", (String) entry.get("title"));
				    datum.put("date", (String) entry.get("publishedDate"));
				    datum.put("link", (String) entry.get("link"));
				    data.add(datum);

					adapter.notifyDataSetChanged();
				}

			} catch (JSONException e) {
				e.printStackTrace();
			}
			
			toast.cancel();
			
			Toast.makeText(activity.getBaseContext(), "Complete",
					Toast.LENGTH_SHORT).show();
			
			// etResponse.setText(result);
		}
	}
}
