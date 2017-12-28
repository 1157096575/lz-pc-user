<div class="layer">
    <img src="${ require('../../images/bj.jpg') }" alt="" />
    <div>This is <%= name %> layer</div>
    <% for(var i = 0; i < arr.length; i++) { %>
        <%= arr[i] %>
    <% } %>
</div>