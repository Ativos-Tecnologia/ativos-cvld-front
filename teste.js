const items = [
    {id:1, title: 'titulo1'},
    {id:2, title: 'titulo2'},
    {id:3, title: 'titulo3'}
];

const updatedItems = [...items];
const [movedItem] = updatedItems.splice(0,1);
updatedItems.splice(2,0,movedItem);





console.log(movedItem, updatedItems)