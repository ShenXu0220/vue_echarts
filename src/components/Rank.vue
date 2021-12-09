<template>
 <div class="com-container">
   <div class="com-chart" ref="rank_ref"></div>
  </div> 
</template>

<script>
  export default {
    name:'Seller',
    data(){
      return{
        chartInstane: null,
        allData: null,//从服务器中获取到的所有的数据
        startValue: 0,//区域缩放的起点值
        endValue: 9,//区域缩放的终点值
        timerId: null
      }
    },
    mounted(){
      this.initChart()//调用初始化 
      this.getData() //获取数据
      // 分辨率的适配
      window.addEventListener('resize', this.screenAdapter)
      // 主动触发各种尺寸的计算
      this.screenAdapter()
    },
    // 有监听，就必须设置取消监听
    beforeDestroy(){
      window.removeEventListener('resize', this.screenAdapter)
      clearInterval(this.timerId)
    },
    methods:{
      // 初始化echarts实例对象的方法
      initChart(){
        this.chartInstane = this.$echarts.init(this.$refs.rank_ref, 'chalk')//在dom元素上初始化
        const initOption = {
          title:{
            text:'▎地区销售排行',
            left: 20,
            top: 20,
          },
          grid:{
            top: '40%',
            left: '5%',
            right: '5%',
            bottom: '5%',
            containLabel: true
          },
          tooltip:{
            show: true
          },
          xAxis:{
            type: 'category'
          },
          yAxis:{
            type: 'value'
          },
          series:[
            {
              type:'bar'
            }
          ]
        }
        this.chartInstane.setOption(initOption)
      },
      // 获取服务器数据的方法
      async getData(){
        const {data : ret} = await this.$http.get('rank')
        this.allData = ret
        // d对allData的每一个元素进行排序，从大到下
        this.allData.sort((a, b)=>{
          return b.value - a.value
        })
        // console.log(this.allData)
        this.updateChart()
        // 调用向左移动的方法
        this.startInterval()
      },
      updateChart(){
        // 定义颜色渐变的颜色值
        const colorArr = [
          ['#0BA82C', '#4FF778'],
          ['#2E72BF', '#23E5E5'],
          ['#5052EE', '#AB6EE5']
        ]
        // 用于处理数据
        // 所有省份形成的数组
        const provinceArr = this.allData.map(item =>{
          return item.name
        })
        // 所有省份对应的销售金额
        const valueArr = this.allData.map(item =>{
          return item.value
        })
        const dataOption = {
          xAxis:{
            data: provinceArr
          },
          dataZoom:{//开启区域缩放
            show: false,//隐藏
            startValue: this.startValue,
            endValue: this.endValue
          },
          series:[
            {
              data: valueArr,
              itemStyle:{
                color: arg => {
                  let targetColorArr = null
                  if(arg.value > 300){
                    targetColorArr = colorArr[0]
                  } else if (arg.value > 200){
                    targetColorArr = colorArr[1]
                  } else {
                    targetColorArr = colorArr[2]
                  }
                  return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: targetColorArr[0]
                    },
                    {
                      offset: 1,
                      color: targetColorArr[1]
                    }
                  ])
                }
              }
            }
          ]
        }
        this.chartInstane.setOption(dataOption)
        this.chartInstane.on('mouseover', ()=>{
          clearInterval(this.timerId)
        })
        this.chartInstane.on('mouseout', ()=>{
          this.startInterval()
        })
      },
      screenAdapter(){
        const titleFontSize = this.$refs.rank_ref.offsetWidth / 100 * 3.6
        const adapterOption = {
          title:{
            textStyle:{
              fontSize: titleFontSize
            }
          },
          series:[
            {
              barWidth: titleFontSize,
              itemStyle:{
                barBorderRadius: [titleFontSize/2, titleFontSize/2, 0, 0]
              }
            }
          ]
        }
        this.chartInstane.setOption(adapterOption)
        this.chartInstane.resize()//用于图表自适应
      },
      // 定义一个方法 ，图表向左移动
      startInterval(){
        if(this.timerId){
          clearInterval(this.timerId)
        }
        this.timerId = setInterval(()=>{
          this.startValue++
          this.endValue++
          if(this.endValue > this.allData.length -1){
            this.startValue = 0
            this.endValue = 9
          }
          this.updateChart()
        }, 2000)
      }
    }
  }
</script>

<style lang="less" scoped></style>