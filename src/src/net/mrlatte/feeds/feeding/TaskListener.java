package net.mrlatte.feeds.feeding;


public interface TaskListener {
	public Object getData();
	public void setData(Object data);
	
	public void onPreExecute();
	public void onPostExecute();
}
