<template>
 <div class="com-container">
   <div class="title" :style="comStyle">
     <span>{{"▎ "+ showTitle}}</span>
     <span class="iconfont title-icon" :style="comStyle" @click="showChoice = !showChoice">&#xe6eb;</span>
     <div class="select-con" v-show="showChoice" :style="marginStyle">
       <div class="select-item" v-for="item in selectType" :key="item.key" @click="handleSelect(item.key)">
         {{ item.text }}
       </div>
     </div>
   </div>
   <div class="com-chart" ref="trend_ref"></div>
  </div> 
</template>

<script>
  export default {
    name:'Trend',
    data(){
      return{
        // 第一步
        chartInstane: null,
        allData: null,//从服务器中获取到的所有的数据
        showChoice: false,//是否显示可选项
        choiceType: 'map',//显示的数据
        titleFontSize: 0//指明标题的字体大小
      }
    },
    // 第五步
    mounted(){
      this.initChart()//调用初始化 
      this.getData() //获取数据
      // 第六步
      // 分辨率的适配
      window.addEventListener('resize', this.screenAdapter)
      // 第八步
      // 主动触发各种尺寸的计算
      this.screenAdapter()
    },
    // 第七步
    // 有监听，就必须设置取消监听
    beforeDestroy(){
      window.removeEventListener('resize', this.screenAdapter)
    },
    computed:{
      selectType(){
        if(!this.allData){
          return []
        }else{
          
          return this.allData.type.filter(item =>{
            return item.key !== this.choiceType
          })
        }
      },
      showTitle(){
        if(!this.allData){
          return ''
        }else{
          return this.allData[this.choiceType].title
        }
      },
      // 设置给标题的样式
      comStyle(){
        return{
          fontSize: this.titleFontSize + 'px'
        }
      },
      marginStyle(){
        return{
          marginLeft:this.titleFontSize + 'px'
        }
      }
    },
    methods:{
      // 第二步
      // 初始化echarts实例对象的方法
      initChart(){
        this.chartInstane = this.$echarts.init(this.$refs.trend_ref, 'chalk')//在dom元素上初始化
        const initOption = {
          grid:{//坐标轴的设置
            left:'3%',
            top:'35%',
            right:'4%',
            bittom:'1%',
            containLabel: true
          },
          tooltip:{//设置工具提示，鼠标移入坐标轴就有提示框
            trigger: 'axis'
          },
          legend:{//设置图例的位置和样式
            left: 20,
            top:'15%',
            icon:'circle'
          },
          xAxis:{
            type:'category',
            boundaryGap:false //设置图表距离y轴是否有间隙
          },
          yAxis:{
            type: 'value'
          }
        }
        this.chartInstane.setOption(initOption)
      },
      // 第三步
      // 获取服务器数据的方法
      async getData(){
        const { data: ret} = await this.$http.get('trend')
        this.allData = ret
        console.log(this.allData)
        this.updateChart()
      },
      // 第四步
      updateChart(){
          // 半透明的颜色值
        const colorArr1 = [
          'rgba(11, 168, 44, 0.5)',
          'rgba(44, 110, 255, 0.5)',
          'rgba(22, 242, 217, 0.5)',
          'rgba(254, 33, 30, 0.5)',
          'rgba(250, 105, 0, 0.5)'
        ]
        // 全透明的颜色值
        const colorArr2 = [
          'rgba(11, 168, 44, 0)',
          'rgba(44, 110, 255, 0)',
          'rgba(22, 242, 217, 0)',
          'rgba(254, 33, 30, 0)',
          'rgba(250, 105, 0, 0)'
        ]
        // 用于处理数据
        const timeArr =  this.allData.common.month//类目轴
        const valueArr = this.allData[this.choiceType].data//series下的data
        const seriesArr = valueArr.map((item, index) =>{
          return {
            name: item.name,
            type:'line',
            data: item.data,
            stack:'this.choiceType',//堆叠图，stack的取相同的名
            areaStyle:{//设置折线图展示面积                //设置颜色的方向
            color:new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset:0,
                color: colorArr1[index]
              },//0%的颜色值
              {
                offset:1,
                color: colorArr2[index]
              }//100%的颜色值
            ])
            }
          }
        })
        // 图例的数据
        const legendArr = valueArr.map(item =>{
          return item.name
        })
        const dataOption = {
          xAxis:{
            data:timeArr,
          },
          legend:{
            data:legendArr
          },
          series:seriesArr
        }
        this.chartInstane.setOption(dataOption)//和数据相关的配置项
      },
      // 第六步
      screenAdapter(){
        this.titleFontSize = this.$refs.trend_ref.offsetWidth / 100 * 3.6
        const adapterOption = {
          legend:{
            itemWidth: this.titleFontSize,
            itemHeight: this.titleFontSize,
            itemGap: this.titleFontSize,
            textStyle:{
              fontSize:this.titleFontSize / 2 
            }
          }
        }
        this.chartInstane.setOption(adapterOption)//关于所有屏幕分辨率相关的配置项
        this.chartInstane.resize()//用于图表自适应
      },
      handleSelect(currentType){
        this.choiceType = currentType
        this.updateChart()
        this.showChoice = false
      }
    }
  }
</script>

<style lang="less" scoped>
  .title{
    position: absolute;
    left: 20px;
    top: 20px;
    z-index: 10;
    color:#fff;
    .title-icon{
      margin-left: 10px;
      cursor: pointer;
    }
    .select-con{
      background: #22273370;
    }
  }
</style>