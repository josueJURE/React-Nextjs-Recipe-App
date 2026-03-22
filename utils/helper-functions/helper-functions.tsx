export function formatDatefunction(date: Date | string  ): string {
    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
}

// type retrieveUserFirstNameProps = {
//   param2: string | undefined
// }


  export function retrieveUserFirstName(
    param: string | undefined
  ): string | undefined {


    let emptyStringIndex = param?.indexOf(" ");
    let splitAtEmpyString = param?.substring(0, emptyStringIndex);
    return splitAtEmpyString;
  }
