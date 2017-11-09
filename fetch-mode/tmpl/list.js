module.exports = function(params=[]){
    return `
<ul>
    ${params.map(val => 
        `<li>
            <h5 class='title' title=${val.title}>${val.title}</h5>
        </li>`
    ).join('')}
</ul>
`;
};