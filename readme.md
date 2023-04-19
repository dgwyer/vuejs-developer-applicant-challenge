# Introduction

This is the repository for my solution to the [VueJS Developer Applicant Challenge](https://awesomemotive.com/vuejs-developer-applicant-challenge/).

*Note: I used React instead of VueJS for this challenge as agreed.*

# Plugin Installation & Activation

I used Node v18.18.1 during development. A similar version is recommended when installing dependencies to avoid any issues.

Follow these steps to installing the plugin:
1. Clone the repository to a location inside the `wp-content/plugins` folders of your local WordPress site.
2. Run `npm install` and then `composer install` from a terminal inside the root plugin directory.
3. Activate the plugin in the WordPress admin.
4. Go to the (top-level) `Test Project` admin settings page.

# Plugin Usage

Once the plugin is installed and activated you should be able to see the plugin admin setting page. The table tab is displayed by default.

![image](https://user-images.githubusercontent.com/1482075/233091050-51a69054-7065-448a-a5ab-ed79e7f68255.png)

If you go to the `Settings` tab then you'll see the correct defaults for `numrows`, `humandate`, and `emails` settings have been applied during activation.

![image](https://user-images.githubusercontent.com/1482075/233091450-fb4b892f-f8ca-4cc2-8b0a-9ffa19ff6807.png)

A bar chart is displayed on the `Graph` tab with data fetched from the external API.

![image](https://user-images.githubusercontent.com/1482075/233091856-8dce3358-10c4-48c8-a1b9-d0f782586bbe.png)

Here are some things you can do to test out the app!

1. Go to any tab and refresh the browser. Note how the active tab is persisted during page reloads.
2. On the `Table` and `Graph` tabs, data is initially fectched from the external API but is cached for up to an hour. Continuously refreshing the page will not fire a new request.
3. However, this can be overridden via the `Graph` tab. If you click the `Refresh` button then new data will be fetched from the external API and the cache is reset for another hour.
4. On the `Settings` tab you can change the number of rows displayed in the table, and also if the date is in human readable form or not. There is also a section where you can enter up to 5 email addresses. These can be deleted by the user by clicking the **`X`** icon to the right of each email in the list.
5. Once 5 email addresses have been entered then the `Add Email` button and text input field are not rendered. As soon as an email has been deleted from the list then the controls reappear.
6. The list of emails are also displayed on the `Table` tab.

# General Comments

Some other comments I noted down during development of the app.

- Settings tab:
  - Only valid email addresses can be added. I used a small [npm package](https://www.npmjs.com/package/email-validator) to do the validation.

# Introduction

This is the repository for my solution to the [VueJS Developer Applicant Challenge](https://awesomemotive.com/vuejs-developer-applicant-challenge/).

*Note: I used React instead of VueJS for this challenge as agreed.*

# Plugin Installation & Activation

I used Node v18.18.1 during development. A similar version is recommended when installing dependencies to avoid any issues.

Follow these steps to installing the plugin:
1. Clone the repository to a location inside the `wp-content/plugins` folders of your local WordPress site.
2. Run `npm install` and then `composer install` from a terminal inside the root plugin directory.
3. Activate the plugin in the WordPress admin.
4. Go to the (top-level) `Test Project` admin settings page.

# Plugin Usage

Once the plugin is installed and activated you should be able to see the plugin admin setting page. The table tab is displayed by default.

![image](https://user-images.githubusercontent.com/1482075/233091050-51a69054-7065-448a-a5ab-ed79e7f68255.png)

If you go to the `Settings` tab then you'll see the correct defaults for `numrows`, `humandate`, and `emails` settings have been applied during activation.

![image](https://user-images.githubusercontent.com/1482075/233091450-fb4b892f-f8ca-4cc2-8b0a-9ffa19ff6807.png)

A bar chart is displayed on the `Graph` tab with data fetched from the external API.

![image](https://user-images.githubusercontent.com/1482075/233091856-8dce3358-10c4-48c8-a1b9-d0f782586bbe.png)

Here are some things you can do to test out the app!

1. Go to any tab and refresh the browser. Note how the active tab is persisted during page reloads.
2. On the `Table` and `Graph` tabs, data is initially fectched from the external API but is cached for up to an hour. Continuously refreshing the page will not fire a new request.
3. However, this can be overridden via the `Graph` tab. If you click the `Refresh` button then new data will be fetched from the external API and the cache is reset for another hour.
4. On the `Settings` tab you can change the number of rows displayed in the table, and also if the date is in human readable form or not. There is also a section where you can enter up to 5 email addresses. These can be deleted by the user by clicking the **`X`** icon to the right of each email in the list.
5. Once 5 email addresses have been entered then the `Add Email` button and text input field are not rendered. As soon as an email has been deleted from the list then the controls reappear.
6. The list of emails are also displayed on the `Table` tab.

# General Comments

Some other comments I noted down during development of the app.

- A spinner displays while the data is fetched from the server.
- If JS isn't enabled then the app isn't loaded and then the page displays a warning message.
- Settings tab:
  - Only valid email addresses can be added. I used a small [npm package](https://www.npmjs.com/package/email-validator) to do the validation.


For email addresses, you can:
Edit any email address.
Delete an email address
Add a new email address.
When editing or adding an email it is validated.
You can only enter up to 5 email addresses. And zero email addresses are allowed.
For the endpoints the setting name is sanitized (has to be numrows, humandate, or emails). Otherwise a WP_Error is thrown.
In the request callback the value of the setting data is also sanitized for correct values. e.g. numrows has to be between 1-5, non-valid email addresses are stripped out, and humandate is set to true if not a boolean.
REST API permissions callback has a WP role and nonce check.
Changes are updated in local state immediately and in the db via REST API endpoint requests. If you change any of the form fields (or multiple form fields) and refresh the page you'll see the changes persist.
The endpoint data from an external API doesn't request new data more than once per hour no matter how many times it is called.
The active tab persists when refreshing the page via localStorage.
Changing the number of rows via the settings tab controls the number of visible table rows.
Also, changing the human date setting toggle data formatting in the table.
The graph was coded by hand and implemented as an SVG rather than using a chart library.
A Refresh button was added to the Chart tab to refresh the chart data manually. This was implemented by adding another REST API endpoint to call the same callback to fetch the data but to delete the data cache first. The refreshed data is immediately cached so that subsequent page reloads persist the data once again.
Styles have been matched to the WP Mail SMTP plugin.
Basic responsive styles have also been added to make the tab content render appropriately at various viewport widths.
A spinner is shown when the app first loads and is waiting for data, and when the chart data is manually refreshed.
All styles are prefixed (in Sass) to reduce any conflicts with core WordPress styles.
When deleting an email a confirm alert box is displayed in case you clicked on the wrong email address.

