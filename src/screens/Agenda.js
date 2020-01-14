import React, {Component} from 'react'
import { StyleSheet,
    Text,
    View,
    ImageBackground,
    FlatList,
    TouchableOpacity,
    Platform,
    AsyncStorage,    
} from 'react-native'
import moment from 'moment'
import 'moment/locale/pt-br'
import todayImage from '../../assets/imgs/today.jpg'
import commonStyles from '../commonStyles'
import Task from '../components/Task'
import Icon from 'react-native-vector-icons/FontAwesome'
import ActionButton from 'react-native-action-button'
import AddTask from './AddTask'

export default class Agenda extends Component {
    
    state= {
        /**tasks: [
            {id: Math.random(), desc: 'Comprar o Curso React Native', estimateAt: new Date(), doneAt: new Date() },
            {id: Math.random(), desc: 'Concluir o Curso', estimateAt: new Date(), doneAt: null },
            {id: Math.random(), desc: 'Comprar o Curso React Native', estimateAt: new Date(), doneAt: new Date() },
            {id: Math.random(), desc: 'Concluir o Curso', estimateAt: new Date(), doneAt: null },
            {id: Math.random(), desc: 'Comprar o Curso React Native', estimateAt: new Date(), doneAt: new Date() },
            {id: Math.random(), desc: 'Concluir o Curso', estimateAt: new Date(), doneAt: null },
            {id: Math.random(), desc: 'Comprar o Curso React Native', estimateAt: new Date(), doneAt: new Date() },
            {id: Math.random(), desc: 'Concluir o Curso', estimateAt: new Date(), doneAt: null },
            {id: Math.random(), desc: 'Comprar o Curso React Native', estimateAt: new Date(), doneAt: new Date() },
            {id: Math.random(), desc: 'Concluir o Curso', estimateAt: new Date(), doneAt: null },
            {id: Math.random(), desc: 'Comprar o Curso React Native', estimateAt: new Date(), doneAt: new Date() },
            {id: Math.random(), desc: 'Concluir o Curso', estimateAt: new Date(), doneAt: null },
        ],*/
        tasks:[],
        visibleTasks: [],
        showDoneTasks: true,
        showAddTask: false,
    }

    addTask = task => {
        const tasks = [...this.state.tasks]
        tasks.push({
            id: Math.random(),
            desc: task.desc,
            estimateAt: task.date,
            doneAt: null
        })
        this.setState({ tasks, showAddTask: false }, this.filterTasks)
    }

    deleteTAsk = id => {
        const tasks = this.state.tasks.filter(task => task.id !== id)
        this.setState({ tasks }, this.filterTasks)
    }

    // Funcao que filtra as tarefas de acordo com o filtro selecionado
    filterTasks = () => {
        let visibleTasks = null
        if ( this.state.showDoneTasks ) {
            visibleTasks = [...this.state.tasks]
        } else {
            const pending = task => task.doneAt === null
            visibleTasks = this.state.tasks.filter(pending)
        }
        this.setState({ visibleTasks })
        AsyncStorage.setItem('tasks', JSON.stringify(this.state.tasks))
    }

    // funcao que altera o estado do filtro para mostrar/ ocultar tarefas pendentes
    toggleFilter = () => {
        this.setState({ showDoneTasks: !this.state.showDoneTasks }, this.filterTasks )
    }

    // Funcao do React que chamada assim que a tela é renderizada pela primeira vez
    componentDidMount = async () => {
        const data = await AsyncStorage.getItem('tasks')
        const tasks = JSON.parse(data) || [] // se data for vazio, retorna um array
        this.setState({ tasks }, this.filterTasks )        
    }

    // funcao que marca uma tarefa como resolvida ou pendente
    toggleTask  = id => {
        const tasks = this.state.tasks.map(task =>{
            if (task.id === id) {
                task = {...task}
                task.doneAt = task.doneAt ? null : new Date()
            }
            return task
        })
        this.setState({ tasks }, this.filterTasks)
    }

    render(){
        return (
            <View style={styles.container}>
                <AddTask isVisible={this.state.showAddTask} onSave={this.addTask} onCancel={() => this.setState({ showAddTask: false})} />
                <ImageBackground source={todayImage} style={styles.background}>
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={this.toggleFilter} >
                            <Icon name={this.state.showDoneTasks ? 'eye' : 'eye-slash'} size={20} color={commonStyles.colors.secondary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Hoje</Text>
                        <Text style={styles.subtitle}>{moment().locale('pt-br').format('ddd, D [de] MMMM')}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskContainer}>
                   <FlatList data={this.state.visibleTasks} keyExtractor={item => `${item.id}`} 
                   renderItem={ ({item}) => <Task {...item} onToggleTask={this.toggleTask} onDelete={this.deleteTAsk} /> } />
                </View>
                <ActionButton buttonColor={commonStyles.colors.today} onPress = {() => {this.setState({ showAddTask: true }) }} />
            </View>
        )    
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 3
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 10,
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30,
    },
    taskContainer: {
        flex: 7
    },
    iconBar: {
        marginTop: Platform.OS === 'ios' ? 30 : 10,
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    }
})