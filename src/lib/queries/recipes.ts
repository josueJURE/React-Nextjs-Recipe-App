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


  export const handleRecipeDeletion = async (id: string) => {
    const response = await fetch(`/api/user/recipe-deletion?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })
    if(!response.ok) {
      // toast("recipe couldn't be deleted")
      throw new Error("something has gone wrong")
    }
    console.log("delete")

  }