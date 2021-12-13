<template>
 <div class="com-container">
   <div class="com-chart" ref="stock_ref"></div>
  </div> 
</template>

<script>
  export default {
    name:'Seller',
    data(){
      return{
        // 第一步
        chartInstane: null,
        allData: null,//从服务器中获取到的所有的数据
        currentIndex: 0,//当前显示的数据
        timerId: null//定时器的一个标识
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
      clearInterval(this.timerId)
    },
    methods:{
      // 第二步
      // 初始化echarts实例对象的方法
      initChart(){
        this.chartInstane = this.$echarts.init(this.$refs.stock_ref, 'chalk')//在dom元素上初始化
        const initOption = {
          title:{
            text:'▎库存和销量分析',
            left: 20,
            top: 20
          },
        }
        this.chartInstane.setOption(initOption)
        // 图表的鼠标移入事件，移入取消定时器
        this.chartInstane.on('mouseover', ()=>{
          clearInterval(this.timerId)
        })
        this.chartInstane.on('mouseout', ()=>{
          this.startInterval()
        })
      },
      // 第三步
      // 获取服务器数据的方法
      async getData(){
        let {data: ret} = await this.$http.get('stock')
        this.allData = ret
        // console.log(this.allData)
        this.updateChart()
        // 调用定时器
        this.startInterval()
      },
      // 第四步
      updateChart(){
        // 圆环位置的数据
        const centerArr = [
          ['18%', '40%'],
          ['50%', '40%'],
          ['82%', '40%'],
          ['34%', '75%'],
          ['66%', '75%']
        ]
        const colorArr = [
          ['#4FF778', '#0BA82C'],
          ['#E5DD45', '#E8B11C'],
          ['#E8821C', '#E55445'],
          ['#5052EE', '#AB6EE5'],
          ['#23E5E5', '#2E72BF']
        ]
        // 用于处理数据
        const start = this.currentIndex * 5
        const end = (this.currentIndex + 1) * 5
        const showData = this.allData.slice(start, end)
        const seriesArr = showData.map((item, index)=>{
          return {
            type: 'pie',
            radius: [110, 100],
            center: centerArr[index],
            hoverAnimation: false, //关闭鼠标移入到饼图时的动画效果
            labelLine:{
              show: false//隐藏指示线
            },
            label:{
              position: 'center',
              color: colorArr[index][0]
            },
            data: [
              {
                name: item.name + '\n' + item.sales,
                value: item.sales,
                itemStyle:{
                  color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset:0,
                      color: colorArr[index][0]
                    },
                    {
                      offset:1,
                      color: colorArr[index][1]
                    }
                  ])
                }
              },
              {
                value: item.stock,
                itemStyle:{
                  color: '#333843'
                }
              }
            ]
          }
        })
        const dataOption = {
          series: seriesArr
        }
        // console.log(dataOption)
        this.chartInstane.setOption(dataOption)//和数据相关的配置项
      },
      // 第六步
      screenAdapter(){
        const titleFontSize = this.$refs.stock_ref.offsetWidth / 100 * 3.6
        const innerRadius = titleFontSize * 2
        const outterRadius = innerRadius * 1.125
        const adapterOption = {
          title:{
            textStyle:{
              fontSize: titleFontSize
            }
          },
          series:[
            {
              type: 'pie',
              radius:[ outterRadius, innerRadius ],
              label:{
                fontSize: titleFontSize / 2
              }
            },
            {
              type: 'pie',
              radius:[ outterRadius, innerRadius ],
              label:{
                fontSize: titleFontSize / 2
              }
            },
            {
              type: 'pie',
              radius:[ outterRadius, innerRadius ],
              label:{
                fontSize: titleFontSize / 2
              }
            },
            {
              type: 'pie',
              radius:[ outterRadius, innerRadius ],
              label:{
                fontSize: titleFontSize / 2
              }
            },
            {
              type: 'pie',
              radius:[ outterRadius, innerRadius ],
              label:{
                fontSize: titleFontSize / 2
              }
            }
          ]
          
        }
        // console.log(adapterOption)
        this.chartInstane.setOption(adapterOption)//关于所有屏幕分辨率相关的配置项
        this.chartInstane.resize()//用于图表自适应
      },
      // 设置定时器
      startInterval(){
        if(this.timerId){
          clearInterval(this.timerId)
        }
        this.timerId = setInterval(()=>{
          this.currentIndex++
          if(this.currentIndex > 1){
            this.currentIndex = 0
          }
          this.updateChart()//在更改完currentIndex之后，要更新界面的显示
        }, 5000)
      }
    }
  }
</script>

<style lang="less" scoped></style>