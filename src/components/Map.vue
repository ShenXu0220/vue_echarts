<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import axios from 'axios'
import {getProvinceMapInfo} from '@/utils/map_utils'
  export default {
    data(){
      return{
        chartInstane: null,
        allData: null,//从服务器中获取到的所有的数据
        mapData:{},//所获取的省份地图的矢量数据
      }
    },
    // 第五步
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
    },
    methods:{
      // 初始化echarts实例对象的方法
      async initChart(){
        this.chartInstane = this.$echarts.init(this.$refs.map_ref, 'chalk')//在dom元素上初始化
        // 获取中国地图的矢量数据
        const ret = await axios.get('http://localhost:9003/static/map/china.json')
        console.log(ret)
        this.$echarts.registerMap('china', ret.data)
        const initOption = {
          title:{
            text:'▎商家分布',
            left: 20,
            top: 20
          },
          geo: {
            type: 'map',
            map: 'china',
            top:'5%',
            bottom:'5%',
            itemStyle:{
              areaColor: '#2172bf',
              borderColor:'#333'
            }
          },
          legend:{
            left: '5%',
            bottom:'5%',
            orient: 'vertical'//图例垂直摆放
          }
        }
        this.chartInstane.setOption(initOption)
        this.chartInstane.on('click', async (arg)=>{
        // console.log('地图被点击了',arg)  arg.name是中文
        const provinceInfo = getProvinceMapInfo(arg.name)
        console.log(provinceInfo)
        // 获取地图的省份的地图矢量数据
        // 判断当前所点击的这个省份的地图矢量数据子啊mapData中是否存在
        if(!this.mapData[provinceInfo.key]){
          const ret = await axios.get('http://localhost:9003' + provinceInfo.path)
          // 设置地图的矢量数据
          this.mapData[provinceInfo.key] = ret.data//缓存省份的地图
          this.$echarts.registerMap(provinceInfo.key, ret.data)
        }
        const changeOption = {
          geo:{
            map:provinceInfo.key
          }
        }
        this.chartInstane.setOption(changeOption)//完成了点击省份放大省份局部
        })
      },
      // 获取服务器数据的方法
      async getData(){
        const {data: ret} = await this.$http.get('map')
        this.allData = ret
        this.updateChart()
      },
      updateChart(){
        // 用于处理数据
        // 图例的数据
        const legendArr = this.allData.map(item =>{
          return item.name
        })
        const seriesArr = this.allData.map(item =>{
          // return 的这个对象是 一个类别下的所有散点数据
          // 如果要在地图中显示散点的数据，所以在给散点的徒步表增加一个配置，coordinateSystem: geo
          return {
            type:'effectScatter',
            rippleEffect:{//设置涟漪效果的
              scale:5,//范围
              brushType: 'stroke'// 空心样式
            },
            name: item.name,
            data: item.children,
            coordinateSystem: 'geo'
          }
        })
        const dataOption = {
          legend:{
            data: legendArr
          },
          series: seriesArr
        }
        this.chartInstane.setOption(dataOption)//和数据相关的配置项
      },
      screenAdapter(){
        // 设置容器和内容的自适应比例
        const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
        const adapterOption = {
          title:{
            textStyle:{
              fontSize: titleFontSize
            }
          },
          legend:{
            itemWidth: titleFontSize / 2,
            itemHeight: titleFontSize / 2,
            itemGap: titleFontSize / 2,//图例文字之间的间隔
            textStyle:{
              fontSize: titleFontSize /2
            }
          }
        }
        this.chartInstane.setOption(adapterOption)//关于所有屏幕分辨率相关的配置项
        this.chartInstane.resize()//用于图表自适应
      },
      // 双击点击容器，回到中国地图
      revertMap(){
        const reverOption = {
          geo:{
            map: 'china'
          }
        }
        this.chartInstane.setOption(reverOption)
      }
    },
    
  }
</script>

<style lang="less" scoped></style>