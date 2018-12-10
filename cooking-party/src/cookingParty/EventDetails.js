import React, {Component} from 'react';
import firebase from '../firebase/firebase.js';
import SearchForRecipe from '../recipes/SearchForRecipe';
import { Link } from "react-router-dom";
import EventCommentSection from './EventCommentSection';

class EventDetails extends Component {
  constructor() {
    super();
    this.state = {
      partyDetails: {},
      firebaseKey: ''
    }
  }
  componentDidMount() {
    const dbRef = firebase.database().ref(`/${this.props.match.params.party_id}`);
    dbRef.on('value', (snapshot) => {
      this.setState({
        partyDetails: snapshot.val() || {},
        firebaseKey: this.props.match.params.party_id
      })
    })
  }
  componentDidUpdate(prevProps) {
    const dbRef = firebase.database().ref(`/${this.props.match.params.party_id}`);
    if (this.props.match.params.party_id !== prevProps.match.params.party_id) {
      dbRef.on('value', (snapshot) => {
        this.setState({
          partyDetails: snapshot.val() || {},
          firebaseKey: this.props.match.params.party_id
        })
      })
    }
  }
  handleClick = (e) => {
    // delete dish from firebase
    const dishFirebaseKey = e.target.id;
    const dishRef = firebase.database().ref(`/${this.state.firebaseKey}/dishes/${dishFirebaseKey}`);
    dishRef.remove();
  }
  printDishes = () => {
    return (
      Object.entries(this.state.partyDetails.dishes).map((dish) => {
        // console.log(dish);
        return (
          <div className="eventDishList clearfix">
            <div className="dishLink">
              <Link to={`/${this.state.firebaseKey}/dishes/${dish[0]}`} className="eventDishName">{dish[1].name}</Link>
            </div>
            <div className="dishDelete">
              <button onClick={this.handleClick} id={dish[0]} className="btn--delete"><i class="fas fa-times"></i></button>
            </div>
          </div>
        )
      })
    )
  }
  render() {
    return (
      <div className="eventDetails">
        <div className="wrapper clearfix">
          <h2 className="eventDetails--title">{this.state.partyDetails.name}</h2>
          <aside className="eventDetailsSection">
            <p><span className="sub__text">Date:</span> {this.state.partyDetails.date}</p>
            {
              this.state.partyDetails.email && (
                <div>
                  <p><span className="sub__text">Invited:</span></p>
                  <ul>
                    {this.state.partyDetails.email.map((person) => {
                      return (
                        <li className="detail__text detail__text--invited">{person}</li>
                        )
                      })}
                  </ul>
                </div>
              )
            }
          </aside>
          <div className="event__main clearfix">  
            {<SearchForRecipe firebaseKey={this.state.firebaseKey}/>}
            {this.state.partyDetails.dishes ? this.printDishes() : null}
            {<EventCommentSection firebaseKey={this.state.firebaseKey} user={this.props.user}/>}
          </div>
        </div>
      </div>
    )
  }
}

export default EventDetails;