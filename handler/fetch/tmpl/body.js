module.exports = function(params=[]){
    return `
${params.map(val => `${val}`).join('')}
`;
};