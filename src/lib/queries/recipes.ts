export const getRetrievingRecipes = async () => {
    const response = await fetch("/api/user/recipe-get-request", {
      headers: {
        "Content-Type": "application/json",
      },
    }
  
    );
    
    console.log("handleRetrievingRecipes");
    if(response.ok) {
      const recipe = await response.json()
      console.log("recipe", recipe)
      return recipe
    } else {
      const error = await response.json()
      console.error(error)
    }
  };