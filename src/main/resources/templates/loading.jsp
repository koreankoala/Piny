<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <style>

:root {
            --color-background: #eaecfa;
            --color-loader: #ce4233;
        }

body {
  background: var(--color-background);
}

.loader {
  width: 250px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  font-family: helvetica, arial, sans-serif;
  text-transform: uppercase;
  font-weight: 900;
  color: var(--color-loader);
  letter-spacing: 0.2em;
  
  &::before, &::after {
    content: "";
    display: block;
    width: 15px;
    height: 15px;
    background: var(--color-loader);
    position: absolute;
    animation: load .7s infinite alternate ease-in-out;
  }
  
  &::before {
    top: 0;
  }
  
  &::after {
    bottom: 0;
  }
}

@keyframes load {
  0% { left: 0; height: 30px; width: 15px }
  50% { height: 8px; width: 40px }
  100% { left: 235px; height: 30px; width: 15px}
}
    </style>


</head>
<body>
    

    <div class="loader">Loading...</div>
</body>
</html>