**Devtool Debug Panel**

This extension provides read debug logs from web server with out integration in html


send from php file log info

```php
header('X-Debugger-Log-ID-0: http://example.com/log1.txt');
header('X-Debugger-Log-ID-1: http://example.com/log2.txt');
```