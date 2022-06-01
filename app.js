//Variables
const form =document.getElementById('request-quote');
const html= new HTMLUI();

//Event Listeners
EventListeners();

function EventListeners(){
    document.addEventListener('DOMContentLoaded',function(){
        // console.log("Hello World");
        html.displayYears();
    });
    
    form.addEventListener('submit',function(e){
        e.preventDefault();

        // Reading selected values from the form
        const make=document.getElementById('make').value;
        const year=document.getElementById('year').value;

        //REading value from radio button
        const level = document.querySelector('input[name="level"]:checked').value;

        //Validating whether there is input or not
        if(make==="" || year === "" || level === ""){
            console.log("error sent");
            html.displayError('All Fields are empty...')
        }
        else{
            //to remove existing div
            const prevResult=document.querySelector('#result div');
            if(prevResult!=null){
                prevResult.remove();
            } 

            //Creating and printing insurance
            // console.log(" "+make+" "+year+" "+level);           
            const insurance= new Insurance(make,year,level);
            const price = insurance.calculateQuote(insurance);

            // printing the result in html
            html.showResults(price,insurance);
        }
    });
    
}
function Insurance(make,year,level) {
    this.make=make;
    this.level=level;
    this.year=year;
}
Insurance.prototype.calculateQuote= function(insurance){
    // console.log(insurance);
    let price;
    const base=2000;

    const make=insurance.make;
     /*1=Bugati Veyron 30%
        2=Lamborghini   20%
        3=Audi  10%
     */
    switch(make){
        case '1':price=base*1.30;
                break;
        case '2':price=base*1.20;
                break;
        case '3':price=base*1.10;
                break;        
    }
    // calculating difference
    const year=insurance.year;
    const diff= this.getYearDifference(year);

    // price
    price = price - ((diff*3)*price)/100;
    // console.log(price);
    const level = insurance.level;
    price=this.calculateLevel(price,level);
    return price;
}

Insurance.prototype.getYearDifference = function(year){
    return new Date().getFullYear() - year;
}

Insurance.prototype.calculateLevel=function(price,level){
    // basic insurance is going to increase the value by 30% and complete will increase by 50%
    if(level==='basic'){
        price=price*1.30;
    }
    else{
        price=price*1.50;
    }
    return price;
}

//Using protyping to create an object.
function HTMLUI() {}

//Displays the latest 20 years in the select tag
HTMLUI.prototype.displayYears = function(){
    // max and min year to display
    const max = new Date().getFullYear();
    const min = max-20;
    // console.log(max+" "+min);
        
    // Generating the list with the 20 years

    const selectYears=document.getElementById('year');
    //Creating the option for select tag in html
    for(let i=max;i>=min;i--){
        const option=document.createElement('option');
        option.value=i;
        option.textContent=i;
        selectYears.appendChild(option);
    }
}

//Function for displaying error
HTMLUI.prototype.displayError= function(msg){
    //creating a div for message
    const div =document.createElement('div');
    div.classList='error';

    //insert the message
    div.innerHTML=`<p>${msg}</p>`;

    form.insertBefore(div, document.querySelector('.form-group'));
    setTimeout(() => {
        document.querySelector('.error').remove();
    }, 3000);
}

//Prints the results into html UI

HTMLUI.prototype.showResults=function(price,insurance){
    const result=document.getElementById('result');

    //creating a div 
    const div= document.createElement('div');
    let make=insurance.make;
    switch (make) {
        case '1':
            make='Bugati Veyron';
            break;
        case '2':
            make='Lamborghini';
            break;
        case '3':
            make='Audi';
            break;
    }
    div.innerHTML=`
    <p class="header">Summary </p>
    <p>Make or Model: ${make}</p>
    <p>Year of Manufacture: ${insurance.year}</p>
    <p>Level of insurance: ${insurance.level}</p>
    <p class="total"> Total Price: &#x20b9 ${price}</p>
    `;

    //inserting the spinner
    const spinner=document.querySelector('#loading img');
    spinner.style.display='block';
    setTimeout(() => {
        spinner.style.display='none';
        result.appendChild(div);
    }, 3000);
    
}