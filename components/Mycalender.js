import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function Mycalender() {
	const [value, onChange] = useState(new Date());

	return (
		<div>
			<h1>Date</h1>
			<Calendar onChange={onChange} value={value} onCl />
		</div>
	);
}
