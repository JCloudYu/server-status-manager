const block = require('list_child');

module.exports = function(params=[]){
    return `
<ul class='server'>
    ${params.map(val => 
        `<li>
            ${block(val)}
        </li>`
    ).join('')}
</ul>
`;
};