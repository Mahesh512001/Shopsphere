	when if fased first error after developed all code

Error1

when i have completed my all controller and all configuration we 
then we faced error like (No operation defined in spec!)


Reason

problem is swagger could not find any valid controller endpoints. this can happen when

Controller are not registered
MapControllers() is missing.
Controller routing attributes are missing
swagger services are not configured correctly.

How i fixed this 

in program.cs we added 

builder.Services.AddController();
builder.Services.AddEndpointApiExplorer();
builder.Services.AddSwaggerGen();

And configured swagger and Controller:

if(app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwagger();
}

app.MapControllers();


we also used proper attributes in the controller:

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
	[HttpGet]
	public IActionResult GetProducts()
	{
		//code
	}
}


Swagger only display api endpoint when controller , routes and swagger services are configured correctly.


Error2 

Error faced 
while connecting the application to sql server  i got an erro similar to:

Login fails for user ''
or 
Cannot open database requested by the login

Reason

The connection string in appsetting.json was incorrect 

possible reasons:

	Wrong sql server instance 
	Wrong database name
	sql Authentication vs window Authontication mismatch
	Missig Trusted_connection= true.

how to fixed this error



we corrected the connection string 

"ConnectionStrings": {
 "DefaultConnection": "Server=Your_SERVER_NAME;Database=ShopSphereDb;trusted_Connection=True;TrustServerCertificate=True;"
}

then In program.cs

builder.Services.AddDbContext<ShopSphereDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

what i Learned 
	Always verify the server name
	check whether you're using Windows Authentication or Sql Authentication.
	Store connction Strings in appsetting.json not directly in code.
	TrustServerCeritficate=true helps avoid cerficate issues in local development.




Error3

Error faced
	
When adding a migration EF core showed a error similar to:

An error was generated for warning
'Microsoft.EntityFrameworkCore.Migration.PendingModeChangeWarning'

or 

The model has pending changes.
Add a  new migration before upeating the database.

Reason 
The product model (or DbContext) was changed but a new migration ahad not been Created.


Example:

public class Product 

{
	public int Id{get; set;}
	public string Name {get; set;}
		
	//Newly added property
	public string? ImageUrl{get; set;}
}
The model changed, but Sql Server still had the old table structure.
 

how to fix this 

create a new migration 
Add-Migration-AddImageUrl
Then update the database
Update-database
if the migration itself was wrong , remove it first;
remove-migration
then recreate it

what i Learned
Every time you change an entity model you must create a new migration
After creating the migration, run Update-Database to apply the changes.
Remove-Migration only removes the last migration if it hasn't been applied to the database.


error3

Reason

Entity model changed but migration not created.

Fix

Add-Migration MigrationName
Update-Database

Learned

Every model change requires a new migration.



error4

Problem

Typed

remove migration

instead of

Remove-Migration

Learned

EF Core commands are exact.



error5

Problem

Didn't know what migration name to give.

Fix

Use meaningful names.

Examples

InitialCreate
AddImageUrl
AddPriceColumn
UpdateProductTable

Learned

Migration names should describe the database change



Error6

Reason

EF didn't know how many decimal places to store.

Fix

builder.Entity<Product>()
       .Property(x => x.Price)
       .HasPrecision(18,2);

Learned

Always configure decimal precision.


Error7

Error

HTTP ERROR 404

when opening

https://localhost:7272/Product/image.png

Reason

Wrong folder path.

Fix

Images stored in

wwwroot/Images/Product

and enable static files.

app.UseStaticFiles();

Learned

Images inside wwwroot are publicly accessible.


	
8. Image URL Wrong

Instead of

Product/image.png

correct path became

Images/Product/image.png

Learned

Store relative paths in SQL.



9. React Couldn't Load Images

Reason

React received only

Images/Product/image.png

Browser needed

https://localhost:7272/Images/Product/image.png

Fix

const imageUrl =
`https://localhost:7272/${product.imageUrl}`;




10. CORS Error

Error

Access to fetch blocked by CORS

Reason

React and API used different ports.

Fix

builder.Services.AddCors(...)

app.UseCors(...)







11. Forgot app.UseCors()

Added

AddCors()

but forgot

UseCors()

Learned

Registering and using middleware are two different steps.



12. Axios Request Failed

Reason

API wasn't running.

Wrong URL.

CORS.

Learned

Always test API in Swagger first.

13. Wrong Import Path

Wrong

import ProductCard from ".../components/ProductCard"

import ProductCard from "../components/ProductCard"



14. product is undefined

Wrong

<ProductCard product={product}/>

inside App.jsx.

product didn't exist.

Correct place:

products.map(product=>...)



15. key Warning

Wrong

key={index}

Better

key={product.id}

Learned

Always use unique IDs.




16. false Typo

Typed

fasle

instead of

false

Simple spelling mistake.





17. Image Not Showing

Wrong

<img src="" />

Correct

<img src={imageUrl}/>





18. White Screen in React

Reason

Wrong import.

Compilation failed.

Used browser console to identify the issue.




19. Failed to Load main.jsx

Reason

Wrong folder/file structure.

Missing

src/main.jsx




20. Dependency Scan Failed

Reason

Wrong file paths.

Vite couldn't resolve imports.





21. PUT Update ID Mismatch

Error

ID mismatch

Reason

Route ID and body ID differed.

Example

PUT /api/products/5

Body

{
"id":7
}



22. SQL Validation Bypass

Question

If I update SQL manually, will C# validation run?

Answer

❌ No.

SQL changes bypass API validation.





23. AddRange() vs Add()

Learned

Add()

One record.

AddRange()

Multiple records.



24. Product Images

Initially tried storing image files.

Learned that database should usually store only

Image URL

not the actual image file.




25. React Data Flow

Initially confused about

API
↓

Axios

↓

response

↓

response.data

↓

useState

↓

map()

↓

ProductCard

Now fully understood.




26. Props Confusion

Initially thought

Props = Hooks

Learned

Props

➡ Parent → Child communication

Hooks

➡ Component features (useState, useEffect, etc.)




27. Parent & Child Components

Learned

App
│
├── Navbar
├── Products
└── Footer

App is the parent.



28. map() Confusion

Initially thought

product

was the index.

Learned

products.map((product,index))
product → current object
index → position





29. object-cover vs object-contain

Learned

object-cover

Fills the area (may crop).

object-contain

Shows the whole image (may leave empty space).






30. Tailwind Basics

Learned

bg-* → Background
rounded-* → Rounded corners
shadow-* → Shadow
p-* → Padding (inside)
m-* → Margin (outside)

























