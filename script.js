// Define time ranges at the top of the script
let timeRanges = [];
function setTimeRange(startHour, startMin, endHour, endMin, color, image) {
    timeRanges.push({
        start: startHour * 60 + startMin,
        end: endHour * 60 + endMin,
        color: color,
        image: image
    });
}

setTimeRange(6, 45, 7, 0, "yellow", "clothes.png");
setTimeRange(7, 0,  7, 20, "green", "cereal.png");
setTimeRange(7, 20, 7, 25, "orange", "hairbrush.jpg");
setTimeRange(7, 25, 7, 30, "purple", "toothbrush.png");
setTimeRange(7, 30, 7, 35, "blue", "shoes.jpg");
setTimeRange(7, 35, 7, 40, "aquamarine", "jacket.png");
setTimeRange(7, 40, 8, 0, "red", "car.png");

setTimeRange(18, 30, 18, 40, "blue", "toothbrush.png");
setTimeRange(18, 40, 18, 50 , "green", "quran.png");
setTimeRange(18, 50, 19, 0, "aqua", "book.png");

// Initialize clock
const canvas = document.getElementById('clock');
const ctx = canvas.getContext('2d');
const radius = 200;
canvas.width = radius * 2;
canvas.height = radius * 2;

// Clock hands
const hourHand = {
    length: radius * 0.5,
    width: 10
};
const minuteHand = {
    length: radius * 0.7,
    width: 7
};
const secondHand = {
    length: radius * 0.8,
    width: 4
};

function drawClock() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get current time
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = currentHour * 60 + now.getMinutes();

    // Draw clock face
    ctx.beginPath();
    ctx.arc(radius, radius, radius - 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();

    // Find all ranges within the current hour
    const currentHourRanges = timeRanges.filter(range => {
        const rangeHour = Math.floor(range.start / 60);
        return rangeHour === currentHour;
    });

    // Draw all time ranges for the current hour
    for (const range of currentHourRanges) {
        drawTimeRange(range);
    }

    // Draw clock border
    ctx.beginPath();
    ctx.arc(radius, radius, radius - 10, 0, 2 * Math.PI);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw numbers
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    for (let num = 1; num <= 12; num++) {
        const angle = (num / 6) * Math.PI;
        const x = radius + Math.sin(angle) * (radius - 30);
        const y = radius - Math.cos(angle) * (radius - 30);
        ctx.fillText(num.toString(), x, y);
    }

    // Find the active range for the image
    const activeRange = timeRanges.find(range =>
        currentMinutes >= range.start && currentMinutes < range.end
    );

    // Show the image for the active range only
    if (activeRange) {
        showImage(activeRange.image);
    } else {
        showImage('');
    }

    // Draw clock hands
    const seconds = now.getSeconds();
    const minutes = now.getMinutes() + seconds / 60;
    const hours = now.getHours() % 12 + minutes / 60;

    drawHand(hours * 30, hourHand, 'black');
    drawHand(minutes * 6, minuteHand, 'black');
    drawHand(seconds * 6, secondHand, 'red');

    // Center dot
    ctx.beginPath();
    ctx.arc(radius, radius, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();
}




function drawHand(angle, hand, color) {
    const radianAngle = (angle - 90) * Math.PI / 180;
    ctx.beginPath();
    ctx.lineWidth = hand.width;
    ctx.lineCap = 'round';
    ctx.moveTo(radius, radius);
    ctx.lineTo(
        radius + Math.cos(radianAngle) * hand.length,
        radius + Math.sin(radianAngle) * hand.length
    );
    ctx.strokeStyle = color;
    ctx.stroke();
}

function drawTimeRange(range) {
    // Calculate start and end angles based on minutes
    const startMinutes = range.start % 60;
    const endMinutes = range.end % 60;

    // Convert minutes to angles (-Math.PI/2 is 12 o'clock)
    const startAngle = (startMinutes / 60) * 2 * Math.PI - Math.PI/2;

    // Handle end time (0 minutes means full hour)
    let endAngle;
    if (endMinutes === 0) {
        endAngle = Math.PI * 3/2; // Back to 12 o'clock
    } else {
        endAngle = (endMinutes / 60) * 2 * Math.PI - Math.PI/2;
    }

    // Draw the arc
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius - 10, startAngle, endAngle);
    ctx.lineTo(radius, radius);
    ctx.fillStyle = range.color;
    ctx.fill();
}



function showImage(imagePath) {
    const imageContainer = document.getElementById('image-container');
    imageContainer.style.backgroundImage = imagePath ? `url(${imagePath})` : 'none';

    // Make sure the image scales appropriately
    imageContainer.style.backgroundSize = 'contain';
    imageContainer.style.backgroundPosition = 'center';
}

// Global variable to store the wake lock
let wakeLock = null;

// Function to request wake lock
async function requestWakeLock() {
  try {
    // Check if the Wake Lock API is supported
    if ('wakeLock' in navigator) {
      // Request a screen wake lock
      wakeLock = await navigator.wakeLock.request('screen');
      
      console.log('Wake Lock is active');
      
      // Listen for release event
      wakeLock.addEventListener('release', () => {
        console.log('Wake Lock was released');
      });
      
    } else {
      console.log('Wake Lock API not supported in this browser');
    }
  } catch (err) {
    console.error(`Failed to request Wake Lock: ${err.message}`);
  }
}

// Function to release wake lock
function releaseWakeLock() {
  if (wakeLock) {
    wakeLock.release()
      .then(() => {
        wakeLock = null;
      });
  }
}

// Add event listeners to handle page visibility changes
document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState === 'visible') {
    // Page is visible again, reacquire the wake lock
    await requestWakeLock();
  } else {
    // Page is hidden, release wake lock if it exists
    if (wakeLock) {
      releaseWakeLock();
    }
  }
});

// Request wake lock when the page loads
window.addEventListener('load', async () => {
  await requestWakeLock();
});


// Update clock every second
setInterval(drawClock, 1000);

// Initial draw
drawClock();
