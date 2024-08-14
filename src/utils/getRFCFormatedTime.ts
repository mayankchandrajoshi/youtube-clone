export function getRFC3339DateTime(interval: "hour"|"day"|"week"|"month"|"year"): string {
    const now: Date = new Date();
    let subtractedDate: Date;
    
    switch (interval) {
      case "hour":
        subtractedDate = new Date(now.getTime() - (60 * 60 * 1000));
        break;
      case "day":
        subtractedDate = new Date(now.getTime() - (24 * 60 * 60 * 1000));
        break;
      case "week":
        subtractedDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        break;
      case "month":
        subtractedDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
        break;
      case "year":
        subtractedDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
        break;
    }
    
    const isoDateTime: string = subtractedDate.toISOString();
    const rfc3339DateTime: string = isoDateTime.slice(0, 19) + "Z";
    return rfc3339DateTime;
  }
  