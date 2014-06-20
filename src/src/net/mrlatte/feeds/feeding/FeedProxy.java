package net.mrlatte.feeds.feeding;

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
import android.view.View;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.SimpleAdapter;

public class FeedProxy {

	private SimpleAdapter adapter;
	private List<Map<String, String>> data = new ArrayList<Map<String, String>>();
	private ProgressBar progressBar = null;

	public FeedProxy(Activity activity, ListView listView,
			ProgressBar progressBar) {
		this.progressBar = progressBar;
		
		this.adapter = new SimpleAdapter(activity.getBaseContext(), data,
				android.R.layout.simple_list_item_2, new String[] { "title",
						"date" }, new int[] { android.R.id.text1,
						android.R.id.text2 });

		listView.setAdapter(adapter);
	}

	public String getLink(int index) {
		if (this.data.size() > index) {
			return this.data.get(index).get("link");
		}

		return null;
	}

	public void getFeed(String url) {
		class TaskListenerImpl implements TaskListener {

			private Object data;
			private ProgressBar progressBar;

			public TaskListenerImpl(ProgressBar progressBar) {
				this.progressBar = progressBar;
			}

			@Override
			public Object getData() {
				return data;
			}

			@Override
			public void setData(Object data) {
				this.data = data;
			}

			@Override
			public void onPreExecute() {
				if (this.progressBar != null) {
					this.progressBar.setVisibility(View.VISIBLE);
				}
			}

			@Override
			public void onPostExecute() {
				if (this.progressBar != null) {
					this.progressBar.setVisibility(View.GONE);
				}
			}
		}

		TaskListenerImpl taskListenerImpl = new TaskListenerImpl(
				this.progressBar);
		taskListenerImpl.setData(url);

		new HttpAsyncTask(taskListenerImpl).execute();
	}

	private class HttpAsyncTask extends AsyncTask<Object, Object, Object> {

		private TaskListener taskListener;

		public HttpAsyncTask(TaskListener taskListener) {
			this.taskListener = taskListener;
		}

		private String getData(String url) {
			InputStream inputStream = null;
			String result = "";

			if (url != null) {
				try {
					HttpClient httpclient = new DefaultHttpClient();

					HttpResponse httpResponse = httpclient.execute(new HttpGet(
							url));

					inputStream = httpResponse.getEntity().getContent();

					if (inputStream != null) {
						result = convertInputStreamToString(inputStream);
					} else {
						result = "";
					}

				} catch (Exception e) {
					// Log.d("InputStream", e.getLocalizedMessage());
				}
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

		@Override
		protected String doInBackground(Object... data) {
			taskListener.onPreExecute();

			return getData(taskListener.getData().toString());
		}

		@Override
		protected void onPostExecute(Object result) {
			try {
				JSONObject obj = new JSONObject(result.toString());
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
			
			taskListener.onPostExecute();
		}
	}
}
