**Devtool Debug Panel**

This extension provides read debug logs from web server with out integration in html


send from php file log info

```php
header('X-Debugger-Log-ID-0: http://example.com/log1.txt');
header('X-Debugger-Log-ID-1: http://example.com/log2.txt');
```

log example
```html
<ul class="nav nav-tabs mb-3 mt-1 justify-content-center" role="tablist">
  <li class="nav-item">
    <a class="nav-link active" id="tab-1-tab" data-toggle="tab" href="#tab-1" role="tab" aria-controls="tab-1" aria-selected="true">Tab 1</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" id="tab-2-tab" data-toggle="tab" href="#tab-2" role="tab" aria-controls="tab-2" aria-selected="false">Tab 2</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" id="tab-3-tab" data-toggle="tab" href="#tab-3" role="tab" aria-controls="tab-3" aria-selected="false">Tab 3</a>
  </li>
</ul>
<div class="tab-content">
  <div class="tab-pane fade show active" id="tab-1" role="tabpanel" aria-labelledby="tab-1-tab">
  <table class="table table-sm">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Column 1</th>
      <th scope="col">Column 1</th>
      <th scope="col">Column 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>some info</td>
      <td>some info</td>
      <td>some info</td>
    </tr>
	<tr>
      <th scope="row">2</th>
      <td>some info</td>
      <td>some info</td>
      <td>some info</td>
    </tr>
	<tr>
      <th scope="row">3</th>
      <td>some info</td>
      <td>some info</td>
      <td>some info</td>
    </tr>    
  </tbody>
</table>
  </div>
  <div class="tab-pane fade" id="tab-2" role="tabpanel" aria-labelledby="tab-2-tab">
	Some content 
  </div>
  <div class="tab-pane fade" id="tab-3" role="tabpanel" aria-labelledby="tab-3-tab">Some content other</div>
</div>
```

Note: search is performed on the rows of the table