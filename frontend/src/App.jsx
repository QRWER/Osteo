import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const modalRef = useRef(null);
    const [phone, setPhone] = useState('');

    // Открытие модалки
    const openModal = () => {
        setIsModalOpen(true);
        setSelectedDate(null);
        setSelectedTime(null);
        setShowSuccess(false);
    };

    // Закрытие модалки
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Закрытие по клику вне модалки
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeModal();
            }
        };

        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen]);

    // Генерация недели для календаря
    const getWeekDays = (baseDate) => {
        const day = new Date(baseDate);
        const dayOfWeek = day.getDay();
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        day.setDate(day.getDate() + diffToMonday);
        const week = [];
        for (let i = 0; i < 7; i++) {
            const copy = new Date(day);
            copy.setDate(day.getDate() + i);
            week.push(copy);
        }
        return week;
    };

    const weekDays = getWeekDays(currentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const handleDateSelect = (date) => {
        const normalized = new Date(date);
        normalized.setHours(0, 0, 0, 0);
        setSelectedDate(normalized);
        setSelectedTime(null);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    const handlePrevWeek = () => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() - 7);
            return newDate;
        });
    };

    const handleNextWeek = () => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + 7);
            return newDate;
        });
    };

    const formatSelectedDate = () => {
        if (!selectedDate) return '';
        return selectedDate.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            weekday: 'long',
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const name = e.target.name.value;

        if (!selectedDate || !selectedTime) {
            alert('Пожалуйста, выберите дату и время');
            return;
        }
        if (phone.length !== 18) {
            console.log(phone.length)
            alert('Введите номер телефона')
            return;
        }


        setPhone('')
        console.log('Запись:', { name, phone, date: selectedDate, time: selectedTime });
        setShowSuccess(true);

        setTimeout(() => {
            closeModal();
        }, 3000);
    };

    const formatPhone = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 11);
        if (!digits) return '';
        let formatted = '+7';
        if (digits.length > 1) {
            formatted += ` (${digits.slice(1, 4)}`;
            if (digits.length >= 4) {
                formatted += `) ${digits.slice(4, 7)}`;
                if (digits.length >= 7) {
                    formatted += `-${digits.slice(7, 9)}`;
                    if (digits.length >= 9) {
                        formatted += `-${digits.slice(9, 11)}`;
                    }
                }
            }
        }
        return formatted;
    };

    const handlePhoneChange = (e) => {
        const input = e.target;
        const selectionStart = input.selectionStart;
        const selectionEnd = input.selectionEnd;

        const rawValue = input.value;
        const digits = rawValue.replace(/\D/g, '');

        if (rawValue.length < phone.length) {
            setPhone(rawValue);
            return;
        }

        const formatted = formatPhone(rawValue);
        setPhone(formatted);
    };

    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    const monthYear = `${monthNames[weekDays[0].getMonth()]} ${weekDays[0].getFullYear()}`;

    return (
        <>
            <div className="cover">
                <div className="header">
                    <p className="header-text">Екатерина Мигаль</p>
                    <div className="links-container">
                        <a href="#"> Home </a>
                        <a href="#"> Мой метод </a>
                        <a href="#"> История преображения </a>
                        <a href="#"> Обо мне</a>
                    </div>
                    <button className="button" onClick={openModal}>Записаться на прием</button>
                </div>
                <div className="hero">
                    <div className="hero-content">
                        <h1>Устали носить маску успеха, когда внутри — пустота и выгорание?</h1>
                        <p>Я помогаю успешным женщинам собрать себя воедино: вернуть энергию,
                            наладить отношения и снова радоваться жизни, не бросая бизнес.</p>
                    </div>
                    <div className="hero-image">
                        <img src="image/main_photo.png" alt="Мотивирующее фото"/>
                    </div>
                </div>
            </div>

            <div className="cover">
                <section className="about-you">

                    <div className="about-wrapper">
                        <div className="about-text">
                            <h2 className="about-title-little">Это про вас?</h2>
                            <p>Ваша боль мне знакома. Я не просто изучила её по книгам — я прошла её сама и нашла выход</p>
                        </div>
                        <div className="cards">
                            <div className="card">
                                <div className="card-image-wrapper">
                                    <img src="image/card_image_1.png" alt="card image"/>
                                </div>
                                <h3>Пустота внутри</h3>
                                <p>Со стороны у вас «все есть», а внутри — тревога и чувство, что вы «не свою жизнь»
                                    живете.</p>
                            </div>
                            <div className="card">
                                <div className="card-image-wrapper">
                                    <img src="image/card_image_2.png" alt="card image"/>
                                </div>
                                <h3>Бесконечная гонка</h3>
                                <p>Вы разрываетесь между бизнесом, семьей и заботой о других, а на себя сил не остается.</p>
                            </div>
                            <div className="card">
                                <div className="card-image-wrapper">
                                    <img src="image/card_image_3.png" alt="card image"/>
                                </div>
                                <h3>Отсутствие перемен</h3>
                                <p>Вы пробовали психологов, отдых, спорт, но возвращались к тому же состоянию.
                                    Потому что работали со следствием, а не с причиной.</p>
                            </div>
                        </div>
                    </div>

                </section>
            </div>


            <div className="cover">
                <section className="intro-me">
                    <h1 className="intro-title">Познакомимся?</h1>

                    <div className="intro-row">
                        <p className="intro-text">Меня зовут <b>Екатерина Мигаль</b>. Я тоже прошла через выгорание и ощущение, что
                            живу не свою жизнь.
                            Моя цель — быть проводником для таких же ярких женщин, как вы, на пути назад к себе — цельной,
                            гармоничной и полной сил.</p>

                        <div className="hero-image intro-photo">
                        </div>
                    </div>
                </section>
            </div>

            <section className="about-you">
                <div className="pattern pattern-left" aria-hidden="true"></div>
                <div className="pattern pattern-right" aria-hidden="true"></div>

                <h2 className="about-title">Сделайте первый шаг</h2>

                <button className="button" onClick={openModal}>Записаться</button>
            </section>

            {isModalOpen &&
                <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={closeModal}>&times;</span>
                    <h2 className="intro-modal">Записаться на
                        консультацию</h2>
                    {!showSuccess ? (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Ваше имя:</label>
                            <input type="text" id="name" name="name" required placeholder="Введите ваше имя"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Номер телефона:</label>
                            <input type="tel" id="phone" name="phone" value={phone} onChange={handlePhoneChange} required placeholder="+7 (XXX) XXX-XX-XX"/>
                        </div>

                        <div className="calendar-container">
                            <div className="calendar-header">
                                <button type="button" className="calendar-nav" onClick={handlePrevWeek}>←</button>
                                <div className="calendar-title">{monthYear}</div>
                                <button type="button" className="calendar-nav" onClick={handleNextWeek}>→</button>
                            </div>

                            <div className="calendar-weekdays">
                                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                                    <div key={day} className="weekday">{day}</div>
                                ))}
                            </div>

                            <div className="calendar-days">
                                {weekDays.map((day, idx) => {
                                    const dayOnly = new Date(day);
                                    dayOnly.setHours(0, 0, 0, 0);
                                    const isToday = dayOnly.getTime() === today.getTime();
                                    const isSelected = selectedDate && dayOnly.getTime() === selectedDate.getTime();
                                    const isPast = dayOnly < today;

                                    return (
                                        <div
                                            key={`${dayOnly.toISOString().split('T')[0]}-${idx}`}
                                            className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isPast ? 'disabled' : ''}`}
                                            onClick={() => !isPast && handleDateSelect(day)}
                                        >
                                            {day.getDate()}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {selectedDate && (
                            <div className="time-slots">
                                <h4>Выберите время:</h4>
                                <div className="time-buttons">
                                    {[10,11,12,13,14,15,16,17,18].map(hour => {
                                        const timeStr = `${hour}:00`;
                                        return (
                                            <button
                                                key={timeStr}
                                                type="button"
                                                className={`time-btn ${selectedTime === timeStr ? 'selected' : ''}`}
                                                onClick={() => handleTimeSelect(timeStr)}
                                            >
                                                {timeStr}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {selectedDate && selectedTime && (
                            <div className="selected-date-time">
                                <strong>Выбрано:</strong> {formatSelectedDate()}, {selectedTime}
                            </div>
                        )}

                        <button type="submit" className="submit-btn">Подтвердить запись</button>
                    </form>
                    ): (
                            <div className="success-message">
                                <h3>Спасибо за заявку!</h3>
                                <p>Мы свяжемся с вами в ближайшее время.</p>
                            </div>
                        )}
                </div>
            </div>
            }
        </>
    );
}

export default App;