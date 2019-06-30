import React from 'react'
import { Redirect,Link } from "react-router-dom"
import { AwesomeButton,AwesomeButtonProgress } from "react-awesome-button";
import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";
import { withRouter } from 'react-router';
class Menu extends React.Component{
    state={redirect:false}
    
    render(){
        if (this.state.redirect==='playground') {
            console.log("True")
            return <Redirect push to='playground'/>;
          }
        else if (this.state.redirect==='ranking'){
            return<Redirect push to ="ranking"/>
        }
        return (
        <>
            <div style={{margin:'30px 20%',padding:"10%"}}>
            <h1>Weblokus</h1>
            <AwesomeButtonProgress
                size={'large'}
                type={'primary'}
                disabled={false}
                fakePress={false}
                
                action={(element, next) => { 
                    setTimeout(() => {
                    next();
                    }, 3000000);
                    this.setState({redirect: "playground"})
                }
               
            }
            >
                Play or Return 
            </AwesomeButtonProgress>

            <AwesomeButtonProgress
                size={'large'}
                type={'primary'}
                disabled={false}
                fakePress={false}
                
                action={(element, next) => { 
                    setTimeout(() => {
                    next();
                    }, 3000000);
                    this.setState({redirect: "ranking"})
                }
               
            }
            >
                Ranking
            </AwesomeButtonProgress>
            </div>
           
    
           
        </>  
    );}
}

export default withRouter( Menu);