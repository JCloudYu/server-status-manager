module.exports = function(params={}){
    let {js=[], css=[], body=''} = params;
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    ${css.map(val => `<link type='text/css' rel='stylesheet' href='${val}' />`).join('')}
    ${js.map(val => `<script src='${val}'></script>`).join('')}
</head>
<body>
    ${body}
</body>
</html>
`;
};