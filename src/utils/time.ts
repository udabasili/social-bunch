export const prefix = (value: number) => {
    if(value > 1){
        return 's ago'
    } else{
        return ' ago'
    }
}

export const timeAgo = (timeValue: {seconds: number}) => {

    const timeDiff =  (Date.now() - new Date(timeValue.seconds * 1000).getTime()) 
    const seconds = Math.abs(timeDiff) / 1000;
    let interval = Math.floor(seconds / 31536000)
    if (interval >= 1){
        return interval + ' year' +  prefix(interval);
    }
    interval = Math.floor(seconds / 2628000)
    if (interval >= 1) {
        return interval + ' month' + prefix(interval);
    }

    interval = Math.floor(seconds / 604800)
    if (interval >= 1) {
        return interval + ' week' + prefix(interval);
    }

    interval = Math.floor(seconds / 86400)
    if (interval >= 1) {
        return interval + ' day' + prefix(interval);
    }

    interval = Math.floor(seconds / 3600)
    if (interval >= 1) {
        return interval + ' hour' + prefix(interval);
    }

    interval = Math.floor(seconds / 60)
    if (interval >= 1) {
        return interval + ' minute' + prefix(interval);
    }

    return Math.floor(seconds) + ' second' + prefix(seconds);
}