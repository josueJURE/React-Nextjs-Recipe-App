export function formatDatefunction(date: Date | string  ): string {
    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
}


  export function retrieveUserFirstName(userName?: string): string | undefined {
    const firstName = userName?.trim().split(/\s+/)[0];
    return firstName || undefined;
  }

  export function currentYear(date: Date | number) : number {
    return new Date(date).getFullYear()
  }
  
